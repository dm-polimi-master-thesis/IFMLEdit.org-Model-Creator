// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function update(cell) {
    var tree = cell.attributes.pattern[0].tree,
        filters = _.filter(tree['filters-list'].attributes.fields, function (field) {
          var fields = _.map(tree['results-list'].attributes.filters, function (filter) { return filter.label });
          return _.includes(fields, field.label);
        });
    return {
      type: 'update',
      name: tree['pattern-container'].attributes.name,
      searchField: tree['keyword-form'].attributes.fields[0] ? tree['keyword-form'].attributes.fields[0].label : '',
      selectedDetailsName: tree['result-details'].attributes.name,
      collectionName: tree['results-list'].attributes.collection,
      filterName: filters[0] ? filters[0].label : '',
      resultsFields: _.map(tree['results-list'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}),
      selectedFields: _.map(tree['result-details'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }}),
      filtersFields: _.map(tree['filters-list'].attributes.fields, function (f) {return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
