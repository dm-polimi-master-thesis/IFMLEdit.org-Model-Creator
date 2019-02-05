// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var _ = require('lodash'),
    generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

async function removeField (options) {
    var ifmlModel = options.ifmlModel,
        fieldName = options.name,
        elementName = options.element,
        fieldType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : 'text',
        elementType = options.elementType ? options.elementType.toLowerCase().replace(/\W/g,"-") : undefined,
        idElement = elementName && elementType ? toId(elementName,'-' + elementType) : undefined;

    var element = idElement ? ifmlModel.getCell(idElement) : options.selectedElement;

    if(!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.ViewComponent') {
        $.notify({message: 'The selected element is not characterized by fields. Select a form, list or details element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var fields = element.attributes.fields;
    fields = _.filter(fields, function (field) { return field.label !== fieldName });
    element.attributes.fields = fields;
    return;
}

exports.removeField = removeField;
