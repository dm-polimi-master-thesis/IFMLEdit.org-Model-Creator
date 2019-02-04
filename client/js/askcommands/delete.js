// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function deleteElement(options) {
    var element = id ? ifmlModel.getCell(id) : options.selectedElement;
}

exports.deleteElement = deleteElement;
