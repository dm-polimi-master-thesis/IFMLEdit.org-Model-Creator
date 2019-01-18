// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree;

    tree['pattern-container'].attributes.name = template.name,
    tree['keyword-form'].attributes.fields = template.search,
    tree['keyword-flow'].attributes.bindings = [{input: template.search[0].label, output: template.search[0].label }],
    tree['results-list'].attributes.collection = template.list.collection,
    tree['results-list'].attributes.fields = template.list.fields,
    tree['results-list'].attributes.filters = template.search
    tree['result-details'].attributes.name = template.details.name,
    tree['result-details'].attributes.collection = template.list.collection
    tree['result-details'].attributes.fields = template.details.fields
}

exports.load = load;
