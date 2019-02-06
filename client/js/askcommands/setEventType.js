// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function setEventType (options) {
    var ifmlModel = options.ifmlModel,
        elementName = options.element,
        type = options.type,
        id = elementName ? toId(elementName,'-event') : undefined;

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (!element) {
        $.notify({message: 'The selected element is not an event or does not exist...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    element.attributes.stereotype = type !== 'user' ? type : undefined;
    element._stereotypeChanged();
}

exports.setEventType = setEventType;
