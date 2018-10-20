// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('./toId.js');

function navigationFlowGenerator(options) {
    var bindings = _.map(options.fields, function(field){
        return {
            input: field,
            output: field
        }
    });

    return {
        attributes: {
            type: 'ifml.NavigationFlow',
            id: 'from-' + options.source + '-to-' + options.target + "-navigation-flow",
            bindings: bindings,
            source: options.source,
            target: options.target
        }
    }
}

function dataFlowGenerator(options) {
    var bindings = _.map(options.fields, function(field){
        return {
            input: field,
            output: field
        }
    });

    return {
        attributes: {
            type: 'ifml.DataFlow',
            id: 'from-' + options.source + '-to-' + options.target + "-data-flow",
            bindings: bindings,
            source: options.source,
            target: options.target
        }
    }
}

exports.navigationFlowGenerator = navigationFlowGenerator;
exports.dataFlowGenerator = dataFlowGenerator;
