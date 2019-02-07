// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        graph = cell.graph,
        steps = template.steps,
        count = template.steps.length;

    tree['pattern-container'].prop('name',template.name);

    while (count >= 1) {
        var parentViewContainer = graph.getCell(tree['step-' + count + '-list'].attributes.parent);
        parentViewContainer.prop('name',steps[count-1].name);

        tree['step-' + count + '-list'].prop('collection',steps[count-1].collection);
        tree['step-' + count + '-list'].attributes.fields = steps[count-1].fields;
        tree['step-' + count + '-list'].attributes.filters = count !== 1 ? steps[count-2].filters : [];

        if (count !== steps.length) {
            tree['step-' + count + '-flow'].prop('bindings', _.map(steps[count-1].filters, function (f) {return {input: f.label, output: f.label}}));
        }
        count--;
    }

    tree['result-details'].prop('name',template.details.name);
    tree['result-details'].prop('collection',template.details.collection);
    tree['result-details'].attributes.fields = template.details.fields;
}

exports.load = load;
