// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function generate(options) {
    var ifmlModel = options.ifmlModel,
        name = options.name,
        type = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = name ? toId(name,'-' + type) : undefined,
        template = {
            elements: [],
            relations: []
        };

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (!element) {
        switch (type) {
          case 'view-container':
            template.elements.push(generator(template, {
                    type: 'ifml.ViewContainer',
                    id: idValidator(id),
                    name: name
            }));
            break;
          case 'action':
            template.elements.push(generator(template, {
                    type: 'ifml.Action',
                    id: idValidator(id),
                    name: name
            }));
            break;
          default:
            $.notify({message: 'You try to generate an element that require to be insert inside a parent. Use insert command instead.'}, {allow_dismiss: true, type: 'danger'});
            return undefined;
        }
        return template;
    } else {

    }
}

exports.generate = generate;
