// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        regularValues = fieldsManipulator.toRegularValues(template.filters.fields),
        specialValues = fieldsManipulator.toSpecialValues(template.filters.fields);

    tree['pattern-container'].prop('name',template.name);
    tree['keyword-form'].attributes.fields = template.search;
    tree['keyword-flow'].prop('bindings', [{input: template.search[0].label, output: template.search[0].label }]);
    tree['results-list'].prop('collection',template.list.collection);
    tree['results-list'].attributes.fields = template.list.fields;
    tree['results-list'].attributes.filters = _.flattenDeep([template.search, regularValues, specialValues]);
    tree['result-details'].prop('name',template.details.name);
    tree['result-details'].prop('collection',template.list.collection);
    tree['result-details'].attributes.fields = template.details.fields;
    tree['filters-form'].prop('collection',template.filters.name);
    tree['filters-form'].attributes.fields = template.filters.fields;
    tree['filters-flow'].prop('bindings', _.map(_.flattenDeep([regularValues,specialValues]), function (f) {return {input: f.label, output: f.label}}));
}

exports.load = load;
