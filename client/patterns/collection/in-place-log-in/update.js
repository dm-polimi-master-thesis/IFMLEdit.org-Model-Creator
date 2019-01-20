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
        editorOption: tree['editor-form'] ? true : false,
        editorFormName: tree['editor-form'] ? tree['editor-form'].attributes.name : "",
        logInFormName: tree['log-in-form'].attributes.name,
        editorFields: tree['editor-form'] ? _.map(tree['editor-form'].attributes.fields, function (f) { return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' } }) : [],
        logInFields: tree['log-in-form'] ? _.map(tree['log-in-form'].attributes.fields, function (f) { return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' } }) : []
    }
}

exports.update = update;
