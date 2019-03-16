// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

async function insert (options) {
    var ifml = options.ifml,
        ifmlModel = options.ifmlModel,
        elementName = options.name,
        elementType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        parentName = options.parent,
        childName = options.child,
        childType = options.childType ? options.childType.replace(/\W/g,"-") : undefined,
        idElement = elementName ? toId(elementName,'-' + elementType) : options.selectedElementId,
        idParent = parentName ? toId(parentName,'-view-container') : undefined,
        idChild = childName && childType ? toId(childName,'-' + childType) : undefined,
        position = options.position,
        clonedGraph = options.clone || ifmlModel.cloneSubgraph(ifmlModel.getCells()),
        elements = [],
        links = [],
        parent = idParent ? ifmlModel.getCell(idParent) : undefined,
        child = idChild ? ifmlModel.getCell(idChild) : undefined,
        recursion = options.recursion || false,
        template = {
            elements: [],
            relations: []
        },
        elementStereotype,
        size;

    if (elementType === 'event') {
        if(idElement && ifmlModel.getCell(idElement)) {
            $.notify({message: 'Another event with the same name is already present in the model'}, {allow_dismiss: true, type: 'danger'});
            return;
        }
        template.elements.push(generator(template, {
            type: 'ifml.Event',
            id: idValidator(idElement),
            name: options.name,
            text: options.name,
            parent: parent.id,
            position: {x: parent.position().x, y: parent.position().y + 40}
        }));

        var element = ifml.fromJSON({ elements: template.elements , relations: []})[0];
        ifmlModel.addCell(element);
        return;
    }

    if (elementType === 'navigation-flow' || elementType === 'data-flow') {
        $.notify({message: 'Insert command is not provided for link element.'}, {allow_dismiss: true, type: 'danger'});
            return;
    }

    if(idElement && ifmlModel.getCell(idElement)) {
        if(!recursion) {
            elements = _.flattenDeep([ifmlModel.getCell(idElement), ifmlModel.getCell(idElement).getEmbeddedCells({deep:'true'})]);
        } else {
            elements = _.flattenDeep([clonedGraph[idElement], ifmlModel.getCell(idElement).getEmbeddedCells({deep:'true'})])
        }
    }

    if (!recursion && idChild && !child) {
        $.notify({message: 'Child element not found... Repeat the command and select an existing child element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (!recursion && child && parent && !(child.attributes.parent === parent.id)) {
        $.notify({message: 'The selected child is not really a child of the selected parent.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    if (!recursion && position && !(child)) {
      $.notify({message: 'If you define a position, you must specify also the child element (name and type) respect to which the insertion must be applied.'}, {allow_dismiss: true, type: 'danger'});
      return;
    }

    if (!recursion && !parent) {
        $.notify({message: 'Parent element not found... Repeat the command and select an existing parent element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (!recursion && elements[0] && parent.id === ifmlModel.getCell(idElement).attributes.parent) {
        $.notify({message: 'The element is already insert in the selected parent view container.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var modelElements = ifmlModel.getElements(),
        rightToParent = parent.attributes.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().x + parent.size().width) <= element.position().x && element.id !== idElement }) : undefined,
        leftToParent = parent.attributes.parent === undefined ? _.filter(modelElements, function (element) { return (element.position().x + element.size().width) <= parent.position().x && element.id !== idElement }) : undefined,
        upToParent = parent.attributes.parent === undefined ? _.filter(modelElements, function (element) { return (element.position().y + element.size().height) <= parent.position().y && element.id !== idElement }) : undefined,
        downToParent = parent.attributes.parent === undefined ? _.filter(modelElements, function (element) { return (parent.position().y + parent.size().height) <= element.position().y && element.id !== idElement }) : undefined;

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
            size: size
        }));

        console.log(template);
        console.log(template.elements);
        console.log(ifml.fromJSON({ elements: template.elements , relations: []}));
        console.log(ifml.fromJSON({ elements: template.elements , relations: []})[0]);

        elements = [ifml.fromJSON({ elements: template.elements , relations: []})[0]];
        clonedGraph[idElement] = elements[0];
    } else {
        var num = elements.length;
        elements = _.filter(elements, function (element) { return !element.isLink() });

        if (!recursion) {
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
            await delay(num * 100);
        }
    }

    if (!child) {
        if (!recursion) {
            _.forEach(elements, function (element) {
                element.position(parent.position().x + 20, parent.position().y + 40);
                positionX(clonedGraph, element, parent.position().x + 20);
                positionY(clonedGraph, element, parent.position().y + 40);
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
                y = child.position().y + child.size().height + 20;
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

        var initialPos = elements[0].position();

        elements[0].position(x,y);
        positionX(clonedGraph, elements[0], x);
        positionY(clonedGraph, elements[0], y);

        _.forEach(elements, function (element,index) {
            if(index !== 0){
                var delta = {
                        x: Math.abs(initialPos.x - element.position().x),
                        y: Math.abs(element.position().y - initialPos.y)
                    };
                element.position(elements[0].position().x + delta.x, elements[0].position().y + delta.y);
                positionX(clonedGraph, element, elements[0].position().x + delta.x);
                positionY(clonedGraph, element, elements[0].position().y + delta.y);
            }
        })
    }
    var modelsInParentArea = ifmlModel.findModelsInArea({ x: clonedGraph[parent.id].position().x, y: clonedGraph[parent.id].position().y, width: clonedGraph[parent.id].size().width, height: clonedGraph[parent.id].size().height }),
        el = elements[0],
        par = clonedGraph[parent.id],
        paddingCoordinates = {
            nw: { x: par.position().x + 20, y: par.position().y + 40 },
            ne: { x: par.position().x + par.size().width - 20, y: par.position().y + 40 },
            sw: { x: par.position().x + 20, y: par.position().y + par.size().height - 20 },
            se: { x: par.position().x + par.size().width - 20, y: par.position().y + par.size().height - 20 }
        },
        elementCoordinates = {
            nw: { x: el.position().x, y: el.position().y },
            ne: { x: el.position().x + el.size().width, y: el.position().y },
            sw: { x: el.position().x, y: el.position().y + el.size().height },
            se: { x: el.position().x + el.size().width, y: el.position().y + el.size().height }
        };
    if (!(paddingCoordinates.nw.x <= elementCoordinates.nw.x && paddingCoordinates.nw.y <= elementCoordinates.nw.y && paddingCoordinates.se.x >= elementCoordinates.se.x && paddingCoordinates.se.y >= elementCoordinates.se.y)) {
        if (paddingCoordinates.nw.x > elementCoordinates.nw.x) {
            var delta = paddingCoordinates.nw.x - elementCoordinates.nw.x;
            positionX(clonedGraph, parent, clonedGraph[parent.id].position().x - delta);
            sizeX(clonedGraph, parent, clonedGraph[parent.id].size().width + delta);
        }
        if (paddingCoordinates.ne.x < elementCoordinates.ne.x) {
            var delta = elementCoordinates.ne.x - paddingCoordinates.ne.x;
            sizeX(clonedGraph, parent, clonedGraph[parent.id].size().width + delta);
        }
        if (paddingCoordinates.nw.y > elementCoordinates.nw.y) {
            var delta = paddingCoordinates.nw.y - elementCoordinates.nw.y;
            positionY(clonedGraph, parent, clonedGraph[parent.id].position().y - delta);
            sizeY(clonedGraph, parent, clonedGraph[parent.id].size().height + delta);
        }
        if (paddingCoordinates.sw.y < elementCoordinates.sw.y) {
            var delta = elementCoordinates.sw.y - paddingCoordinates.sw.y;
            sizeY(clonedGraph, parent, clonedGraph[parent.id].size().height + delta);
        }
    }
    var rect = {x: elementCoordinates.nw.x - 20, y: elementCoordinates.nw.y - 20, width: elements[0].size().width + 20, height: elements[0].size().height + 20 },
        modelsInElementArea = ifmlModel.findModelsInArea(rect);
        modelsInElementArea = _.filter(modelsInElementArea, function (el) { return el.id !== parent.id && el.attributes.parent === parent.id && el.id !== idElement });

    if (modelsInElementArea.length > 0) {

        if (!child && !recursion) {
            var min = modelsInElementArea.length > 0 ? modelsInElementArea.reduce((min, el) => el.position().x < min ? el.position().x : min, modelsInElementArea[0].position().x) : 0,
                delta = modelsInElementArea.length > 0 ? elementCoordinates.ne.x - min + 20 : 0;

            _.forEach(elements, function (el) {
                el.position(el.position().x - delta, el.position().y);
            })

            positionX(clonedGraph, parent, elements[0].position().x - 20);
            sizeX(clonedGraph, parent, clonedGraph[parent.id].size().width + delta);
        } else if (child || recursion){
            switch (position) {
              case 'up':
              case 'down':
                  var middle = Math.round((elementCoordinates.ne.x - elementCoordinates.nw.x)/2),
                      rectLeftToMiddle = { x: clonedGraph[parent.id].position().x, y: elementCoordinates.nw.y, width: (elementCoordinates.nw.x + middle) - clonedGraph[parent.id].position().x, height: clonedGraph[idElement].size().height },
                      leftToElement = ifmlModel.findModelsInArea(rectLeftToMiddle),
                      rectRightToMiddle = { x: elementCoordinates.nw.x + middle, y: elementCoordinates.nw.y, width: (clonedGraph[parent.id].position().x + clonedGraph[parent.id].size().width) - (elementCoordinates.nw.x + middle), height: clonedGraph[idElement].size().height },
                      rightToElement = ifmlModel.findModelsInArea(rectRightToMiddle);

                  rightToElement = _.filter(rightToElement, function (el) { return el.attributes.parent === parent.id && el.id !== idElement && el.id !== parent.id && el.position().x > (elementCoordinates.nw.x + middle) });
                  leftToElement = _.filter(leftToElement, function (el) { return el.attributes.parent === parent.id && el.id !== idElement && el.id !== parent.id && el.position().x <= (elementCoordinates.nw.x + middle)});

                  var minRightMiddle = rightToElement.length > 0 ? rightToElement.reduce((min, el) => el.position().x  < min ? el.position().x : min, rightToElement[0].position().x) : 0,
                      maxLeftMiddle = leftToElement.length > 0 ? leftToElement.reduce((max, el) => (el.position().x + el.size().width) > max ? (el.position().x + el.size().width) : max, leftToElement[0].position().x + leftToElement[0].size().width) : 0,
                      deltaRightMiddle = rightToElement.length > 0 ? elementCoordinates.ne.x - minRightMiddle + 20 : 0,
                      deltaLeftMiddle = leftToElement.length > 0 ? maxLeftMiddle - elementCoordinates.nw.x + 20 : 0,
                      moved = [];

                  _.forEach(rightToElement, function (el) {
                      positionX(clonedGraph, el, clonedGraph[el.id].position().x + deltaRightMiddle);
                      _.forEach(el.getEmbeddedCells({deep:'true'}), function (embed) {
                          if (!moved[embed.id] && !embed.isLink()) {
                              positionX(clonedGraph, embed, clonedGraph[embed.id].position().x + deltaRightMiddle);
                              moved[embed.id] = true;
                          }
                      });

                      if ((clonedGraph[parent.id].position().x + clonedGraph[parent.id].size().width - 20) < (clonedGraph[el.id].position().x + clonedGraph[el.id].size().width)) {
                          var delta = (clonedGraph[el.id].position().x + clonedGraph[el.id].size().width) - (clonedGraph[parent.id].position().x + clonedGraph[parent.id].size().width - 20);
                          sizeX(clonedGraph, parent, clonedGraph[parent.id].size().width + delta);
                      }
                  });

                  moved = [];

                  _.forEach(leftToElement, function (el) {
                      positionX(clonedGraph, el, clonedGraph[el.id].position().x - deltaLeftMiddle);

                      _.forEach(el.getEmbeddedCells({deep:'true'}), function (embed) {
                          if (!moved[embed.id] && !embed.isLink()) {
                              positionX(clonedGraph, embed, clonedGraph[embed.id].position().x - deltaLeftMiddle);
                              moved[embed.id] = true;
                          }
                      });

                      if ((clonedGraph[parent.id].position().x + 20) > clonedGraph[el.id].position().x) {
                          var delta = clonedGraph[parent.id].position().x + 20 - clonedGraph[el.id].position().x;
                          positionX(clonedGraph, parent, clonedGraph[el.id].position().x - 20);
                          sizeX(clonedGraph, parent, clonedGraph[parent.id].size().width + delta);
                      }
                  });
                  break;

              case 'right':
              case 'left':
                  var middle = Math.round((elementCoordinates.sw.y - elementCoordinates.nw.y)/2),
                      rectUpToMiddle = {x: elementCoordinates.nw.x, y: clonedGraph[parent.id].position().y, width: clonedGraph[idElement].size().width, height: (elementCoordinates.nw.y + middle) - clonedGraph[parent.id].position().y },
                      upToElement = ifmlModel.findModelsInArea(rectUpToMiddle),
                      rectDownToMiddle = {x: elementCoordinates.nw.x, y: (elementCoordinates.nw.y + middle), width: clonedGraph[idElement].size().width, height: (clonedGraph[parent.id].position().y + clonedGraph[parent.id].size().height) - (elementCoordinates.nw.y + middle) },
                      downToElement = ifmlModel.findModelsInArea(rectDownToMiddle);

                  upToElement = _.filter(upToElement, function (el) { return el.attributes.parent === parent.id && el.id !== idElement && el.id !== parent.id && el.position().y <= (elementCoordinates.nw.y + middle) });
                  downToElement = _.filter(downToElement, function (el) { return el.attributes.parent === parent.id && el.id !== idElement && el.id !== parent.id && el.position().y > (elementCoordinates.nw.y + middle)});

                  var maxUpMiddle = upToElement.length > 0 ? upToElement.reduce((max, el) => (el.position().y + el.size().height) > max ? el.position().y + el.size().height : max, upToElement[0].position().y + upToElement[0].size().height) : 0,
                      minDownMiddle = downToElement.length > 0 ? downToElement.reduce((min, el) => el.position().y < min ? el.position().y : min, downToElement[0].position().y) : 0,
                      deltaUpMiddle = upToElement.length > 0 ? maxUpMiddle - elementCoordinates.nw.y + 20 : 0,
                      deltaDownMiddle = downToElement.length > 0 ? elementCoordinates.sw.y - minDownMiddle + 20 : 0,
                      moved = [];

                  _.forEach(upToElement, function (el) {
                      positionY(clonedGraph, el, clonedGraph[el.id].position().y - deltaUpMiddle);

                      _.forEach(el.getEmbeddedCells({deep:'true'}), function (embed) {
                          if (!moved[embed.id] && !embed.isLink()) {
                              positionY(clonedGraph, embed, clonedGraph[embed.id].position().y - deltaUpMiddle);
                              moved[embed.id] = true;
                          }
                      });

                      if (clonedGraph[el.id].position().y < (clonedGraph[parent.id].position().y + 20)) {
                          var delta = (clonedGraph[parent.id].position().y) - clonedGraph[el.id].position().y + 40;
                          positionY(clonedGraph, parent, clonedGraph[parent.id].position().y - delta);
                          sizeY(clonedGraph, parent, clonedGraph[parent.id].size().height + delta);
                      }
                  })
                  _.forEach(downToElement, function (el) {
                      positionY(clonedGraph, el, clonedGraph[el.id].position().y + deltaDownMiddle);
                      _.forEach(el.getEmbeddedCells({deep:'true'}), function (embed) {
                          if (!moved[embed.id] && !embed.isLink()) {
                              positionY(clonedGraph, embed, clonedGraph[embed.id].position().y + deltaDownMiddle);
                              moved[embed.id] = true;
                          }
                      });

                      if ((clonedGraph[parent.id].position().y + clonedGraph[parent.id].size().height - 20) < (clonedGraph[el.id].position().y + clonedGraph[el.id].size().height)) {
                          var delta = (clonedGraph[el.id].position().y + clonedGraph[el.id].size().height) - (clonedGraph[parent.id].position().y + clonedGraph[parent.id].size().height - 20);
                          sizeY(clonedGraph, parent, clonedGraph[parent.id].size().height + delta);
                      }
                  });
                  break;
            }
        }
    }

    if (parent.attributes.parent !== undefined) {
        var options = {
                name: parent.attributes.name,
                type: 'view container',
                parent: parent.attributes.parent,
                clone: clonedGraph,
                position: position || 'left',
                recursion: true,
                ifml: ifml,
                ifmlModel: ifmlModel
            };
        insert(options);
    } else {
        var parentExtPadding = {
            nw: { x: clonedGraph[parent.id].position().x - 20, y: clonedGraph[parent.id].position().y - 20 },
            ne: { x: clonedGraph[parent.id].position().x + clonedGraph[parent.id].size().width + 20, y: clonedGraph[parent.id].position().y - 20},
            sw: { x: clonedGraph[parent.id].position().x - 20, y: clonedGraph[parent.id].position().y + clonedGraph[parent.id].size().height + 20 },
            se: { x: clonedGraph[parent.id].position().x + clonedGraph[parent.id].size().width + 20, y: clonedGraph[parent.id].position().y + clonedGraph[parent.id].size().height +20 }
        };

        var maxUp = upToParent.length > 0 ? upToParent.reduce((max, el) => (el.position().y + el.size().height) > max ? el.position().y + el.size().height : max, upToParent[0].position().y + upToParent[0].size().height) : 0,
            deltaUp = upToParent.length > 0 ? maxUp - parentExtPadding.nw.y : 0;

        if (deltaUp > 0) {
            _.forEach(upToParent, function (el) {
                translateY(el, el.position().y - deltaUp);
            });
        }

        var minDown = downToParent.length > 0 ? downToParent.reduce((min, el) => el.position().y < min ? el.position().y : min, downToParent[0].position().y) : 0,
            deltaDown = downToParent.length > 0 ? parentExtPadding.sw.y - minDown : 0;

        if (deltaDown > 0) {
            _.forEach(downToParent, function (el) {
                translateY(el, el.position().y + deltaDown);
            });
        }

        var minRight= rightToParent.length > 0 ? rightToParent.reduce((min, el) => el.position().x  < min ? el.position().x : min, rightToParent[0].position().x) : 0,
            deltaRight = rightToParent.length > 0 ? parentExtPadding.ne.x - minRight : 0;

        if (deltaRight > 0) {
            _.forEach(rightToParent, function (el) {
                translateX(el, el.position().x + deltaRight);
            });
        }

        var maxLeft = leftToParent.length > 0 ? leftToParent.reduce((max, el) => (el.position().x + el.size().width) > max ? (el.position().x + el.size().width) : max, leftToParent[0].position().x + leftToParent[0].size().width) : 0,
            deltaLeft = leftToParent.length > 0 ? maxLeft - parentExtPadding.nw.x : 0;

        if (deltaLeft > 0) {
            _.forEach(leftToParent, function (el) {
                translateX(el, el.position().x - deltaLeft);
            });
        }
    }

    await resize(parent, clonedGraph[parent.id].position(), clonedGraph[parent.id].size());
    var num = modelsInParentArea.length;
    _.forEach(modelsInParentArea, function (el) {
        translateX(el,clonedGraph[el.id].position().x);
        translateY(el,clonedGraph[el.id].position().y);
    })
    await delay(300);

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
            ifmlModel.addCell(elements[0]);
            parent.embed(elements[0]);
        }
    }

    links = _.filter(modelElements, function (link) { return link.isLink() });

    _.forEach(links, function (link) {
        link.router('orthogonal');
    });
}

function positionX (subGraph,node,x) {
    subGraph[node.id].position(x, subGraph[node.id].position().y);
}

function positionY (subGraph,node,y) {
    subGraph[node.id].position(subGraph[node.id].position().x, y);
}

function sizeX (subGraph,node,width) {
    subGraph[node.id].resize(width,subGraph[node.id].size().height);
}

function sizeY (subGraph,node,height) {
    subGraph[node.id].resize(subGraph[node.id].size().width, height);
}

async function fadeIn(element, path) {
    element.attr(path + '/fill-opacity',1);
    element.attr(path + '/stroke-opacity',1);
    var opacity = 0;
    for(var i = 0; i < 5; i ++) {
        opacity += 0.2;
        element.attr(path + '/stroke-opacity',opacity);
        element.attr(path + '/fill-opacity',opacity);
        await delay(1);
    }
}

async function fadeOut(element, path) {
    element.attr(path + '/fill-opacity',0);
    element.attr(path + '/stroke-opacity',0);
    var opacity = 1;
    for(var i = 0; i < 5; i++) {
        opacity -= 0.2;
        element.attr(path + '/stroke-opacity',opacity);
        element.attr(path + '/fill-opacity',opacity);
        await delay(1);
    }
}

function translateX(element, newPos) {
    return new Promise(resolve => {
        element.transition('position/x', newPos, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function translateY(element, newPos) {
    return new Promise(resolve => {
        element.transition('position/y', newPos, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function resizeX(element, newPos, newSize) {
    return new Promise(resolve => {
        element.transition('position/x', newPos, {
            duration: 200
        });
        element.transition('size/width', newSize, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

function resizeY(element, newPos, newSize) {
    return new Promise(resolve => {
        element.transition('position/y', newPos, {
            duration: 200
        });
        element.transition('size/height', newSize, {
            duration: 200
        });
        setTimeout(resolve,200);
    });
}

async function resize(element, newPos, newSize) {
    return new Promise(resolve => {
        resizeX(element, newPos.x, newSize.width);
        resizeY(element, newPos.y, newSize.height);
        setTimeout(resolve,500);
    });
};

function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}

exports.insert = insert;
