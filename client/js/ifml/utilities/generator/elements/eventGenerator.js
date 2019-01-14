// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator;

function generateEvent(template, options) {
    return {
        attributes: {
            name: options.text,
            stereotype: options.stereotype || undefined,
            pattern: options.pattern || undefined
        },
        metadata: {
            graphics: {
                position: options.position || { x: 0, y: 0 },
                name: {
                    horizontal: options.horizontal || 'middle',
                    vertical: options.vertical || 'top'
                }
            }
        },
        id: idValidator(template.elements, options.name, '-event'),
        type: 'ifml.Event'
    }
}

exports.generateEvent = generateEvent;
