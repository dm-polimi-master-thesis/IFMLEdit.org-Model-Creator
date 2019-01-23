// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function update(cell) {
    var tree = cell.attributes.pattern[0].tree;
    return {
        type: 'update',
        name: tree['pattern-container'].attributes.name,
        signUpFormName: tree['sign-up-form'].attributes.name,
        logInFormName: tree['log-in-form'].attributes.name,
        signUpFields: _.map(tree['sign-up-form'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: ko.observable(f.type || 'text'), name: ko.observable(f.name || '') }}),
        logInFields: _.map(tree['log-in-form'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: ko.observable(f.type || 'text'), name: ko.observable(f.name || '') }})
    }
}

exports.update = update;
