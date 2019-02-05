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

async function removeParameter (options) {
    var ifmlModel = options.ifmlModel,
        parameterName = options.name,
        elementName = options.element,
        idElement = elementName ? toId(elementName,'-action') : undefined;

    var element = idElement ? ifmlModel.getCell(idElement) : options.selectedElement;

    if(!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.Action') {
        $.notify({message: 'The selected element is not characterized by parameters. Select an action element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var parameters = element.attributes.parameters;
    parameters = _.filter(parameters, function (parameter) { return parameter.label !== parameterName });
    element.attributes.parameters = parameters;
    return;
}

exports.removeParameter = removeParameter;
