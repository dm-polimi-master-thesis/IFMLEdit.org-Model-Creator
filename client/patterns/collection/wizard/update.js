// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function update(cell) {
    var tree = cell.attributes.pattern[0].tree,
        graph = cell.graph,
        count = 1,
        steps = [];

    for (var key in tree) {
        if(tree['step-' + count + '-form']){
            var step = tree['step-' + count + '-form'],
                parentViewContainer = graph.attributes.cells._byId[step.attributes.parent];

            steps.push({ name: parentViewContainer.attributes.name, formName: step.attributes.name, fields: _.map(step.attributes.fields, function (f) { return { label: f.label, value: f.label, type: ko.observable(f.type || 'text'), name: ko.observable(f.name || '') } }) });

            count++;
        }
    };

    return {
        type: 'update',
        name: tree['pattern-container'].attributes.name,
        steps: steps,
        fields: steps[0].fields
    }
}


exports.update = update;
