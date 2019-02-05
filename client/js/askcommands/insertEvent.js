// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

async function insertEvent (options) {
    var ifml = options.ifml,
        ifmlModel = options.ifmlModel,
        elementName = options.name,
        parentName = options.parent,
        parentType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        idElement = elementName ? toId(elementName,'-event') : undefined,
        idParent = parentName ? toId(parentName,'-' + parentType) : undefined,
        parent = idParent ? ifmlModel.getCell(idParent) : options.selectedElement,
        position = options.position,
        coordinates,
        template = {
            elements: [],
            relations: []
        };

    if(idElement && ifmlModel.getCell(idElement)) {
        $.notify({message: 'Another event with the same name is already present in the model'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if(!parent) {
        $.notify({message: 'Parent element not found... Repeat the command and select an existing parent element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    switch (position) {
      case 'up':
        coordinates = { x: parent.position().x + 20, y: parent.position().y }
        break;
      case 'down':
        coordinates = { x: parent.position().x + 20, y: parent.position().y + parent.size().height - 20 }
        break;
      case 'right':
        coordinates = { x: parent.position().x + parent.size().width - 20, y: parent.position().y + 20 }
        break;
      case 'left':
        coordinates = { x: parent.position().x, y: parent.position().y + 20 }
        break;
      default:
        coordinates = { x: parent.position().x, y: parent.position().y + 40 }
    }

    template.elements.push(generator(template, {
        type: 'ifml.Event',
        id: idValidator(idElement),
        name: options.name,
        text: options.name,
        parent: parent.id,
        position: coordinates
    }));

    var element = ifml.fromJSON({ elements: template.elements , relations: []})[0];
    ifmlModel.addCell(element);
    return;
}

exports.insertEvent = insertEvent;
