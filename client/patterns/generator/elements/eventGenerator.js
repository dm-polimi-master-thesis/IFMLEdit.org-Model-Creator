// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../toId.js');

function generateEvent(options) {
    return {
        attributes: {
            name: options.name
        },
        metadata: {
            graphics: {
                position: options.position || { x: 0, y: 0 },
                name: {
                    horizontal: 'middle',
                    vertical: 'top'
                }
            }
        },
        id: toId(options.name, 'event'),
        type: 'ifml.Event'
    }
}

exports.generateEvent = generateEvent;
