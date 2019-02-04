// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function connect(options) {
    var ifmlModel = options.ifmlModel,
        source = options.source,
        target = options.destination,
        sourceType = options.sourceType ? options.sourceType.toLowerCase().replace(/\W/g,"-") : undefined,
        targetType = options.destinationType ? options.destinationType.toLowerCase().replace(/\W/g,"-") : undefined,
        sourceId = source ? toId(source,'-' + sourceType) : undefined,
        targetId = target ? toId(target,'-' + targetType) : undefined,
        template = {
            elements: [],
            relations: []
        };

    var sourceElement = source ? ifmlModel.getCell(sourceId) : options.selectedElement,
        targetElement = ifmlModel.getCell(targetId);

    if (!sourceElement && !targetElement) {
        $.notify({message: 'Source element and target element not found... Select a existing elements.'}, {allow_dismiss: true, type: 'danger'});
        return undefined;
    } else if (!sourceElement) {
        $.notify({message: 'Source element not found... Select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return undefined;
    } else if (!targetElement) {
        $.notify({message: 'Target element not found... Select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return undefined;
    }

    switch (sourceType) {
      case 'form':
      case 'list':
      case 'details':
        if (targetType === 'action' || targetType === 'event' || targetType === 'view-container') {
          $.notify({message: 'Target element type not admited by the IFML policy for a View Component element...'}, {allow_dismiss: true, type: 'danger'});
          return undefined;
        }
        template.elements.push(generator(template, {
            type: 'ifml.DataFlow',
            name: 'From ' + sourceElement.id + ' to ' + targetElement.id,
            source: sourceElement.id,
            target: targetElement.id
        }));
        return template;
      case 'event':
        if (targetType === 'event' ) {
          $.notify({message: 'Target element type not admited by the IFML policy for a View Component element...'}, {allow_dismiss: true, type: 'danger'});
          return undefined;
        }
        template.elements.push(generator(template, {
            type: 'ifml.NavigationFlow',
            name: 'From ' + sourceElement.id + ' to ' + targetElement.id,
            source: sourceElement.id,
            target: targetElement.id
        }));
        return template;
      default:
        $.notify({message: 'Source element type not admited by the IFML policy for a View Component element...'}, {allow_dismiss: true, type: 'danger'});
        return undefined;
    }
}

exports.connect = connect;
