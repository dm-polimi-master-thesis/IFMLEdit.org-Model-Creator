// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function deleteElement(options) {
    var name = options.name,
        type = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = name ? toId(name,'-' + type) : undefined;

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (element) {
        element.remove();
    } else {
        $.notify({message: 'Element not found... Select an existing element to remove.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

exports.deleteElement = deleteElement;
