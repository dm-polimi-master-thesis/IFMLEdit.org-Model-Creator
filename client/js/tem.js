var elements = ifmlModel.getElements();







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
