// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree;

    tree['pattern-container'].prop('name',template.name);
    tree['alphabet-list'].prop('collection',template.filter.collection);
    tree['alphabet-list'].attributes.fields = template.filter.fields;
    tree['results-list'].prop('collection',template.list.collection);
    tree['results-list'].attributes.fields = template.list.fields;
    tree['results-list'].attributes.filters = template.filter.fields;
    tree['result-details'].prop('name',template.details.name);
    tree['result-details'].prop('collection',template.list.collection);
    tree['result-details'].attributes.fields = template.details.fields;
    tree['filter-flow'].attributes.bindings = [{input: template.filter.fields[0].label, output: template.filter.fields[0].label}];
}

exports.load = load;
