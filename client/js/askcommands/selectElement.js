// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function selectElement(options) {
    var ifmlModel = options.ifmlModel,
        name = options.name,
        type = options.type.toLowerCase().replace(/\W/g,"-"),
        id = toId(name,'-' + type),
        element = ifmlModel.getCell(id);

    return element;
}

exports.selectElement = selectElement;
