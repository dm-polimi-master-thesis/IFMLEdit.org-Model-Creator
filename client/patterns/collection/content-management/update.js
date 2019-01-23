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
        dataOption: tree['data-entry-form'] ? true : false,
        detailsOption: tree['page-details'] ? true : false,
        pageListOption: tree['page-list'] ? true : false,
        selectedDetailsName: tree['page-details'] ? tree['page-details'].attributes.name : "",
        dataEntryFormName: tree['data-entry-form'] ? tree['data-entry-form'].attributes.name: "",
        collectionListName: tree['page-list'] ? tree['page-list'].attributes.collection : "",
        collectionDetailsName: tree['page-details'] ? tree['page-details'].attributes.collection : "",
        resultsFields: tree['page-list'] ? _.map(tree['page-list'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}) : [],
        dataEntryFields: tree['data-entry-form'] ? _.map(tree['data-entry-form'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}) : _.map(tree['page-details'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
