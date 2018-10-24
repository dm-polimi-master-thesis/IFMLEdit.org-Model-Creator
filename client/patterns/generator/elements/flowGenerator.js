// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function generateFlow(options) {
    var bindings = _.map(options.fields, function(field){
        return {
            input: field,
            output: field
        }
    });

    return {
        attributes: {
            bindings: bindings
        },
        metadata: {
            graphics: {
              vertices: options.vertices || undefined
            }
        },
        id: toId(options.name, options.type === 'ifml.DataFlow' ? '-data-flow' : '-navigation-flow'),
        type: options.type
    }
}
exports.generateFlow = generateFlow;
