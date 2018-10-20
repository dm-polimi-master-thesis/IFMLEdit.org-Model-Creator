// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('./toId.js');

function eventGenerator(options) {
    return {
        attributes: {
            type: 'ifml.Event',
            id: toId(options.name + '-' + options.parent,'-event'),
            name: {text: options.name, vertical: "top", horizontal: "middle"},
            navigationFlow: options.navigationFlow || [],
            parent: options.parent,
            matrixPos: options.matrixPos || {x: 1, y: 1},
            size: {
                width: 20,
                height: 20
            }
        }
    }
}

exports.eventGenerator = eventGenerator;
