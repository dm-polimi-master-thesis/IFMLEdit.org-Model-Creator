// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

async function addField (options) {
    var ifmlModel = options.ifmlModel,
        fieldName = options.name,
        elementName = options.element,
        fieldType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : 'text',
        elementType = options.elementType ? options.elementType.toLowerCase().replace(/\W/g,"-") : undefined,
        idElement = elementName && elementType ? toId(elementName,'-' + elementType) : undefined;

    var element = idElement ? ifmlModel.getCell(idElement) : options.selectedElement;

    if (!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.ViewComponent') {
        $.notify({message: 'The selected element is not characterized by fields. Select a form, list or details element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var fields = element.attributes.fields,
        duplicates = _.filter(fields, function (field) { return field.label === fieldName || field.name === fieldName });

    if (duplicates.length > 0) {
        $.notify({message: 'Impossible to add the field. It has the same name of another field or a group name of a checkbox or radio field...'}, {allow_dismiss: true, type: 'danger'});
        return;
    } else {
        fields.push({label: fieldName, value: fieldName, type: fieldType, name: ''});
        return;
    }
}

exports.addField = addField;
