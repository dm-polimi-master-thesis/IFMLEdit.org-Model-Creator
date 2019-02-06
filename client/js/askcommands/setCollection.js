// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function setCollection (options) {
    var ifmlModel = options.ifmlModel,
        name = options.name,
        elementName = options.element,
        elementType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = elementName ? toId(elementName,'-' + elementType) : undefined;

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.ViewComponent' || (element.attributes.stereotype !== 'list' && element.attributes.stereotype !== 'details')) {
        $.notify({message: 'The selected element is not a list or details...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    element.prop('collection', name);
}

exports.setCollection = setCollection;
