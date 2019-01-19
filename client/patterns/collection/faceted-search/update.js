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
      searchField: tree['keyword-form'].attributes.fields[0].label,
      selectedDetailsName: tree['result-details'].attributes.name,
      filtersFormName : tree['filters-form'].attributes.name,
      collectionName: tree['results-list'].attributes.collection,
      resultsFields: _.map(tree['results-list'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}),
      selectedFields: _.map(tree['result-details'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}),
      filtersFields: _.map(tree['filters-form'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
