// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function generateViewContainer(options) {
    var ifmlModel = options.ifmlModel,
        id = toId(options.name,'view-container'),
        properties = options.properties,
        template = {
            elements: [],
            relations: []
        };

    if (properties.xor) {
        if (!properties.parent) {
            $.notify({message: 'You try to insert a View Container with XOR property in a position not allowed by the hierarchy of the elements.'}, {allow_dismiss: true, type: 'danger'});
            return undefined;
        } else {
            var parent = ifmlModel.getCell(properties.parent);
            if (parent.attributes.xor) {
                $.notify({message: 'You try to insert a View Container with XOR property in a position not allowed by the hierarchy of the elements (the parent is a XOR View Container).'}, {allow_dismiss: true, type: 'danger'});
                return undefined;
            }
        }
    }
    if (properties.landmark || properties.default) {
        if (properties.parent) {
            var parent = ifmlModel.getCell(properties.parent);
            if (!parent.attributes.xor) {
                $.notify({message: 'You try to insert a View Container with Landmark or Default property in a position not allowed by the hierarchy of the elements (the parent is not a XOR View Container).'}, {allow_dismiss: true, type: 'danger'});
                return undefined;
            }
        }
    }

    template.elements.push(generator(template, {
        type: 'ifml.ViewContainer',
        id: idValidator(id),
        name: options.name,
        xor: properties.xor,
        landmark: properties.landmark,
        default: properties.default,
        parent: undefined
    }));
    return template;
}

exports.generateViewContainer = generateViewContainer;
