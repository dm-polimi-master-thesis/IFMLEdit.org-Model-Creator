// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function update(cell) {
    var tree = cell.attributes.pattern[0].tree;

    console.log('update', tree);
    console.log('tree',tree['alphabet-list'].attributes.fields);
    return {
        type: 'update',
        name: tree['pattern-container'].attributes.name,
        filterField: tree['alphabet-list'].attributes.fields[0],
        filterCollection: tree['alphabet-list'].attributes.collection,
        resultsCollection: tree['results-list'].attributes.collection,
        selectedDetailsName: tree['result-details'].attributes.name,
        resultsFields: tree['results-list'].attributes.fields,
        selectedFields: tree['result-details'].attributes.fields
    }
}

exports.update = update;
