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
    recursion = options.recursion || false,
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
if (elementType === 'event') {
    $.notify({message: 'Insert command is not available for the Event type. Use the generate command instead.'}, {allow_dismiss: true, type: 'danger'});
    return;
}

var modelElements = ifmlModel.getElements(),
    rightToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return parent.position().x >= element.position().x && parent.id !== element.id }) : undefined,
    leftToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().x + parent.size().width) <= element.position().x && parent.id !== element.id }) : undefined,
    upToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return parent.position().y >= element.position().y && parent.id !== element.id }) : undefined,
    downToParent = parent.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().y + parent.size().height) <= element.position().y) && parent.id !== element.id }) : undefined;

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
    if (!recursion) {
        var num = elements.length;
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
        await delay(num * 150);
    }
}

if (!child) {
    if (!recursion) {
        _.forEach(elements, function (element) {
            element.position(parent.position().x + 20, parent.position().y + 40);
        })
    }
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
    modelsInParentArea = ifmlModel.findModelsInArea({ x: parent.position().x, y: parent.position().y, width: parent.size().width, height: parent.size().height }),
    cloneParentSubGraph = ifmlModel.cloneSubgraph(modelsInParentArea);
    console.log(modelsInArea);
    console.log(cloneParentSubGraph);

if (!(paddingCoordinates.nw.x <= elementCoordinates.nw.x && paddingCoordinates.nw.y <= elementCoordinates.nw.y && paddingCoordinates.se.x >= elementCoordinates.se.x && paddingCoordinates.se.y >= elementCoordinates.se.y)) {
    if (paddingCoordinates.nw.x > elementCoordinates.nw.x) {
        var delta = paddingCoordinates.nw.x - elementCoordinates.nw.x;
        positionX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].position().x - delta);
        sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
    }
    if (paddingCoordinates.ne.x < elementCoordinates.ne.x) {
        var delta = elementCoordinates.ne.x - paddingCoordinates.ne.x;
        sizeX(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].width + delta);
    }
    if (paddingCoordinates.nw.y > elementCoordinates.nw.y) {
        var delta = paddingCoordinates.nw.y - elementCoordinates.nw.y;
        positionY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].position().y - delta);
        sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
    }
    if (paddingCoordinates.sw.y < elementCoordinates.sw.y) {
        var delta = elementCoordinates.sw.y - paddingCoordinates.sw.y;
        sizeY(cloneParentSubGraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
    }
}

var rect = {x: elementCoordinates.nw.x - 20, y: elementCoordinates.nw.y -20, width: elements[0].size().width, height: elements[0].size().height },
    modelsInElementArea = ifmlModel.findModelsInArea(rect);
    modelsInElementArea = _.filter(modelsInElementArea, function (el) { return el.id !== parent.id && el.attributes.parent === parent.id })
if (modelsInElementArea.length > 0) {
    if (!child) {
        var min = modelsInElementArea.reduce((minX, el) => el.position().x < minX ? el.position().x : minX, modelsInElementArea[0].position().x),
            delta = elementCoordinates.ne.x - min + 20;

        _.forEach(elements, function (el) {
            el.position(el.position().x - delta, el.position().y);
        })

        positionX(cloneParentSubGraph, parent, elements[0].position().x - 20);
        sizeX(cloneParentSubgraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
    } else {
        switch (position) {
          case 'up':
          case 'down':
              var middle = Math.round((elementCoordinates.ne.x - elementCoordinates.nw.x)/2),
                  rightMiddle = [],
                  leftMiddle = [];

              _.forEach(modelsInElementArea, function (el) {
                  if(el.position().x <= middle) {
                      rightMiddle.push(el);
                  } else {
                      leftMiddle.push(el);
                  }
              });

              var maxRightMiddle = rightMiddle.reduce((max, el) => (el.position().x + el.size().width) > max ? (el.position().x + el.size().width) : max, rightMiddle[0].position().x + rightMiddle[0].size().width),
                  deltaRightMiddle = maxRightMiddle - elementCoordinates.nw.x + 20,
                  minLeftMiddle = leftMiddle.reduce((min, el) => el.position().x < min ? el.position().x : min, leftMiddle[0].position().x),
                  deltaLeftMiddle = elementCoordinates.ne.x - min + 20;

              _.forEach(rightMiddle, function (el) {
                  positionX(cloneParentSubGraph, el, cloneParentSubGraph[el.id] - deltaRightMiddle);

                  if ((cloneParentSubGraph[parent.id].position().x + 20) > cloneParentSubGraph[el.id].position().x) {
                      var delta = cloneParentSubGraph[parent.id].position().x + 20 - cloneParentSubGraph[el.id].position().x;
                      positionX(cloneParentSubGraph, parent, cloneParentSubGraph[el.id].position().x - 20);
                      sizeX(cloneParentSubgraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
                  }
              })
              _.forEach(leftMiddle, function (el) {
                  positionX(cloneParentSubGraph, el, cloneParentSubGraph[el.id] - deltaLeftMiddle);

                  if ((cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width - 20) < (cloneParentSubGraph[el.id].position().x)) {
                      var delta = cloneParentSubGraph[el.id].position().x - (cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width - 20);
                      sizeX(cloneParentSubgraph, parent, cloneParentSubGraph[parent.id].size().width + delta);
                  }
              });
              break;

          case 'right':
          case 'left':
              var middle = Math.round((elementCoordinates.sw.x - elementCoordinates.nw.x)/2),
                  upMiddle = [],
                  downMiddle = [];

              _.forEach(modelsInElementArea, function (el) {
                  if(el.position().y <= middle) {
                      upMiddle.push(el);
                  } else {
                      downMiddle.push(el);
                  }
              });

              var maxUpMiddle = upMiddle.reduce((max, el) => (el.position().y + el.size().height) > max ? (el.position().y + el.size().height) : max, upMiddle[0].position().y + upMiddle[0].size().height),
                  deltaUpMiddle = maxUpMiddle - elementCoordinates.nw.y + 20,
                  minDownMiddle = downMiddle.reduce((min, el) => el.position().y < min ? el.position().y : min, downMiddle[0].position().y),
                  deltaDownMiddle = elementCoordinates.sw.y - min + 20;

              _.forEach(upMiddle, function (el) {
                  positionY(cloneParentSubGraph, el, cloneParentSubGraph[el.id] - deltaUpMiddle);

                  if ((cloneParentSubGraph[parent.id].position().y + 20) > cloneParentSubGraph[el.id].position().y) {
                      var delta = cloneParentSubGraph[parent.id].position(). y+ 20 - cloneParentSubGraph[el.id].position().y;
                      positionY(cloneParentSubGraph, parent, cloneParentSubGraph[el.id].position().y - 20);
                      sizeY(cloneParentSubgraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
                  }
              })
              _.forEach(downMiddle, function (el) {
                  positionY(cloneParentSubGraph, el, cloneParentSubGraph[el.id] - deltaDownMiddle);

                  if ((cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height - 20) < (cloneParentSubGraph[el.id].position().y)) {
                      var delta = cloneParentSubGraph[el.id].position().y - (cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height - 20);
                      sizeY(cloneParentSubgraph, parent, cloneParentSubGraph[parent.id].size().height + delta);
                  }
              });
              break;
        }
    }
}

if (parent.parent !== undefined) {
    var options = {
            name: parent.name,
            type: parent.type,
            parent: parent.parent,
            recursion: true
        };

    insertElement(options);
} else {
    var parentExtPadding = {
        nw: { x: cloneParentSubGraph[parent.id].position().x - 20, y: cloneParentSubGraph[parent.id].position().y - 20 },
        ne: { x: cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].width + 20, y: cloneParentSubGraph[parent.id].position().y - 20},
        sw: { x: cloneParentSubGraph[parent.id].position().x - 20, y: cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height + 20 },
        se: { x: cloneParentSubGraph[parent.id].position().x + cloneParentSubGraph[parent.id].size().width + 20, y: cloneParentSubGraph[parent.id].position().y + cloneParentSubGraph[parent.id].size().height +20 }
    };

    _.forEach(upToParent, function (el) {
        var elPadding = {
                nw: { x: el.position().x, y: el.position().y },
                ne: { x: el.position().x + el.size().width, y: el.position().y },
                sw: { x: el.position().x, y: el.position().y + el.size().height },
                se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
            };

        if (el.sw.y > parentExtPadding.nw.y && (el.ne.x > parentExtPadding.nw.x || el.nw.x < parentExtPadding.ne.x) {
            var delta = el.sw.y - parentExtPadding.nw.y;
            translateY(el, el.position().y - delta);
        }
    });

    _.forEach(downToParent, function (el) {
        var elPadding = {
                nw: { x: el.position().x, y: el.position().y },
                ne: { x: el.position().x + el.size().width, y: el.position().y },
                sw: { x: el.position().x, y: el.position().y + el.size().height },
                se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
            };

        if (el.nw.y < parentExtPadding.sw.y && (el.ne.x > parentExtPadding.nw.x || el.nw.x < parentExtPadding.ne.x) {
            var delta = parentExtPadding.sw.y - el.nw.y;
            translateY(el, el.position().y + delta);
        }
    });

    _.forEach(rightToParent, function (el) {
        var elPadding = {
                nw: { x: el.position().x, y: el.position().y },
                ne: { x: el.position().x + el.size().width, y: el.position().y },
                sw: { x: el.position().x, y: el.position().y + el.size().height },
                se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
            };

        if (el.nw.x < parentExtPadding.ne.x && (el.nw.y < parentExtPadding.sw.y || el.sw.y > parentExtPadding.ne.y) {
            var delta = parentExtPadding.ne.x - el.nw.x;
            translateX(el, el.position().x + delta);
        }
    });

    _.forEach(leftToParent, function (el) {
        var elPadding = {
                nw: { x: el.position().x, y: el.position().y },
                ne: { x: el.position().x + el.size().width, y: el.position().y },
                sw: { x: el.position().x, y: el.position().y + el.size().height },
                se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
            };

        if (el.ne.x > parentExtPadding.nw.x && (el.nw.y < parentExtPadding.sw.y || el.sw.y > parentExtPadding.nw.y) {
            var delta = parentExtPadding.ne.x - el.nw.x;
            translateX(el, el.position().x - delta);
        }
    });
}

resize(parent, cloneParentSubGraph[parent.id].position(), cloneParentSubGraph[parent.id].size());

_.forEach(modelsInArea, function (el) {
    translateX(el,cloneSubgraph[el].position().x);
    translateY(el,cloneSubgraph[el].position().y);
})

if (!recursion) {
    if(ifmlModel.getCell(idElement)) {
        if(elements[0].attributes.parent){
            var oldParent = ifmlModel.getCell(elements[0].attributes.parent);
            oldParent.unembed(elements[0]);
        }

        parent.embed(elements[0]);

        _.forEach(elements, function (element) {
            if (element.attributes.parent) {
                var parent = ifmlModel.getCell(element.attributes.parent);
                element.set('z',parent.attributes.z + 1);
            }

            if (element.attributes.type === 'ifml.Event') {
                fadeIn(element,'.marker');
            } else {
                fadeIn(element,'.ifml-element');
            }
        });

        _.forEach(links, function (link) {
            fadeIn(link,'.connection');
            fadeIn(link,'.marker-source');
            fadeIn(link,'.marker-target');
        });

        links = _.flattenDeep(links);
    } else {
        fadeIn(elements[0],'.ifml-element');
        ifmlModel.addCell(_.flattenDeep(elements[0]));
        parent.embed(elements[0]);
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
