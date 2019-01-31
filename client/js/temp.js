var elementName = options.name,
    elementType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
    elementStereotype,
    size,
    parentName = options.parent,
    childName = options.child,
    childType = options.childType ? options.childType.replace(/\W/g,"-") : undefined,
    idElement = elementName ? toId(elementName,'-' + elementType) : undefined,
    idParent = parentName ? toId(parentName,'-view-container') : undefined,
    idChild = childName && childType ? toId(childName,'-' + childType) : undefined,
    position = options.position,
    elements = idElement && ifmlModel.getCell(idElement) ? _.flattenDeep([ifmlModel.getCell(idElement), ifmlModel.getCell(idElement).getEmbeddedCells({deep:'true'})]) : [],
    links = [],
    parent = idParent ? ifmlModel.getCell(idParent) : undefined,
    child = idChild ? ifmlModel.getCell(idChild) : undefined,
    template = {
        elements: [],
        relations: []
    };

if (idChild && !child) {
    $.notify({message: 'Child element not found... Repeat the command and select an existing child element.'}, {allow_dismiss: true, type: 'danger'});
    return;
}
if (child && parent && !(child.attributes.parent === parent.id)) {
    $.notify({message: 'The selected child is not really a child of the selected parent.'}, {allow_dismiss: true, type: 'danger'});
    return;
}
if (!parent) {
    $.notify({message: 'Parent element not found... Repeat the command and select an existing parent element.'}, {allow_dismiss: true, type: 'danger'});
    return;
}
if (elements[0] && parent.id === ifmlModel.getCell(idElement).attributes.parent) {
    $.notify({message: 'The element is already insert in the selected parent view container.'}, {allow_dismiss: true, type: 'danger'});
    return;
}

var modelElements = ifmlModel.getElements(),
    rightToParent = _.filter(modelElements, function (element) { return parent.position().x >= element.position.x && parent.id !== element.id }),
    leftToParent = _.filter(modelElements, function (element) { return (parent.position().x + parent.size().width) <= element.position.x && parent.id !== element.id }),
    upToParent = _.filter(modelElements, function (element) { return parent.position().y >= element.position.y && parent.id !== element.id }),
    downToParent = _.filter(modelElements, function (element) { return (parent.position().y + parent.size().height) <= element.position.y) && parent.id !== element.id });

if (!elements[0]) {
    switch (elementType) {
      case 'view-container':
        elementType = 'ifml.ViewContainer';
        size = { height: 160, width: 200 }
        break;
        break;
      case 'action':
        elementType = 'ifml.Action';
        size = { height: 50, width: 75 }
        break;
      case 'event':
        elementType = 'ifml.Event';
        size = { height: 20, width: 20 }
        break;
      case 'form':
        elementType = 'ifml.ViewComponent';
        elementStereotype = 'form';
        size = { height: 60, width: 150 }
        break;
      case 'list':
        elementType = 'ifml.ViewComponent';
        elementStereotype = 'list';
        size = { height: 60, width: 150 };
        break;
      case 'details':
        elementType = 'ifml.ViewComponent';
        elementStereotype = 'details';
        size = { height: 60, width: 150 };
        break;

    }

    template.elements.push(generator(template, {
        type: elementType,
        id: idValidator(idElement),
        name: options.name,
        text: options.name,
        stereotype: elementStereotype,
        parent: parent.id,
        size: size
    }));

    elements = [ifml.fromJSON({ elements: template.elements , relations: []})[0]];
} else {
    elements = _.filter(elements, function (element) { return !element.isLink() });
    _.forEach(elements, function (element) {
        var connectedLinks = ifmlModel.getConnectedLinks(element);

        _.forEach(connectedLinks, function (link) {
            fadeOut(link,'.connection');
            fadeOut(link,'.marker-source');
            fadeOut(link,'.marker-target');
        });

        links.push(connectedLinks);

        if (element.attributes.type === 'ifml.Event') {
            fadeOut(element,'.marker');
        } else {
            fadeOut(element,'.ifml-element');
        }
    });

    links = _.flattenDeep(links);
    await delay(1500);
}

if (!child) {
    _.forEach(elements, function (element) {
        element.position(parent.position().x + 20, parent.position().y + 40);
    })
} else {
    switch (position) {
      case 'up':
        var x = child.position().x - (elements[0].size().width/2 - child.size().width/2),
            y = child.position().y - (elements[0].size().height + 20);
        break;
      case 'down':
        var x = child.position().x - (child.size().width/2 - child.size().width/2),
            y = child.position().y + parent.size().height + 20;
        break;
      case 'right':
        var x = child.position().x + (child.size().width + 20),
            y = child.position().y - (elements[0].size().height/2 - child.size().height/2);
        break;
      case 'left':
        var x = child.position().x - elements[0].size().width - 20,
            y = child.position().y - (elements[0].size().height/2 - child.size().height/2);
        break;
    }
    _.forEach(elements, function (element,index) {
        if(index !== 0){
            var delta = {
                    x: Math.abs(elements[0].position().x - element.position().x),
                    y: Math.abs(element.position().y - elements[0].position().y)
                };
            element.position(x + delta.x, y + delta.y);
        }
    })

    elements[0].position(x,y);
}
var paddingCoordinates = {
        nw: { x: parent.position().x + 20, y: parent.position().y + 40 },
        ne: { x: parent.position().x + parent.size().width - 20, y: parent.position().y + 40 },
        sw: { x: parent.position().x + 20, y: parent.position().y + parent.size().height - 20 },
        se: { x: parent.position().x + parent.size().width - 20, y: parent.position().y + parent.size().height - 20 }
    },
    elementCoordinates = {
        nw: { x: elements[0].position().x, y: elements[0].position().y },
        ne: { x: elements[0].position().x + elements[0].size().width, y: elements[0].position().y },
        sw: { x: elements[0].position().x, y: elements[0].position().y + elements[0].size().height },
        se: { x: elements[0].position().x + elements[0].size().width, y: elements[0].position().y + elements[0].size().height }
    },
    modelsInArea = ifmlModel.findModelsInArea({ x: parent.position().x, y: parent.position().y, width: parent.size().width, height: parent.size().height }),
    cloneSubGraph = ifmlModel.cloneSubgraph(modelsInArea);
    console.log(modelsInArea);
    console.log(cloneSubGraph);

if (!(paddingCoordinates.nw.x <= elementCoordinates.nw.x && paddingCoordinates.nw.y <= elementCoordinates.nw.y && paddingCoordinates.se.x >= elementCoordinates.se.x && paddingCoordinates.se.y >= elementCoordinates.se.y)) {
    if (paddingCoordinates.nw.x > elementCoordinates.nw.x) {
        var delta = paddingCoordinates.nw.x - elementCoordinates.nw.x;
        positionX(cloneSubGraph, parent, parent.position().x - delta);
        sizeX(cloneSubGraph, parent, parent.size().width + delta);
        //resizeX(parent, parent.position().x - delta, parent.size().width + delta);
    }
    if (paddingCoordinates.ne.x < elementCoordinates.ne.x) {
        var delta = elementCoordinates.ne.x - paddingCoordinates.ne.x;
        sizeX(cloneSubGraph, parent, parent.size().width + delta);
    }
    if (paddingCoordinates.nw.y > elementCoordinates.nw.y) {
        var delta = paddingCoordinates.nw.y - elementCoordinates.nw.y;
        positionY(cloneSubGraph, parent, parent.position().y - delta);
        sizeX(cloneSubGraph, parent, parent.size().height + delta);
    }
    if (paddingCoordinates.sw.y < elementCoordinates.sw.y) {
        var delta = elementCoordinates.sw.y - paddingCoordinates.sw.y;
        sizeX(cloneSubGraph, parent, parent.size().height + delta);
    }
}


function positionX (subGraph,node,x) {
    subGraph[element.id].position( x, element.position().y );
}

function positionY (subGraph,node,y) {
    subGraph[element.id].position( element.position().x, y );
}

function sizeX (subGraph,node,width) {
    subGraph[element.id].position({ width: width, height: element.size().height });
}

function sizeY (subGraph,node,height) {
    subGraph[element.id].position({ width: element.size().width, height: height });
}


















var middle = (elementCoordinates.ne.x - elementCoordinates.nw.x)/2,
    delta = 0,
    newParentPos = parent.position().x,
    newParentSize = parent.size().width;

_.forEach(modelsInArea, function (el) {
    if(el.position().x <= middle) {
        delta = el.position().x + el.size().width - elementCoordinates.nw.x - 20;
        await transitionX(el, el.position().x - delta);
        newParentPos
    } else {
        var delta = el.position().x - elementCoordinates.ne.x - 20;
        await transitionX(el, el.position().x - delta);
        if ((parent.position().x + newParentSize) < (el.position().x + delta + el.size().width + 20)) {
            await newParentSize = newParentSize + ((el.position().x + delta + el.size().width + 20) - (parent.position().x + newParentSize));
        }
    }
    transitionX(el, el.position().x - delta);

})
await resizeX(parent, newParentPos, parent.size().width + (parent.position().x - newParentPos));
await resizeX(parent, parent.position().x, newParentSize);
await resizeX(parent, newParentPos, parent.size().height + (newParentPos - parent.position().y));
break;


var middle = (elementCoordinates.ne.x - elementCoordinates.nw.x)/2,
    maxDelta = middle - elementCoordinates.nw.x;
