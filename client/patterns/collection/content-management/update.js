// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function update(cell) {
    var tree = cell.attributes.pattern[0].tree;
    return {
        type: 'update',
        dataEntryOption: tree['data-entry-form'] ? true : false,
        name: tree['pattern-container'].attributes.name,
        selectedDetailsName: tree['page-details'].attributes.name,
        dataEntryFormName: tree['data-entry-form'].attributes.name,
        collectionListName: tree['page-list'].attributes.collection,
        collectionDetailsName: tree['page-details'].attributes.collection,
        resultsFields: tree['page-list'].attributes.fields,
        dataEntryFields: tree['data-entry-form'].attributes.collection
    }
}

exports.update = update;
