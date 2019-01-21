// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function update(cell) {
    var tree = cell.attributes.pattern[0].tree;
    return {
        type: 'update',
        name: tree['pattern-container'].attributes.name,
        detailsName: tree['master-details'].attributes.name,
        collectionName: tree['master-list'].attributes.collection,
        listFields: _.map(tree['master-list'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}),
        detailsFields: _.map(tree['master-details'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
