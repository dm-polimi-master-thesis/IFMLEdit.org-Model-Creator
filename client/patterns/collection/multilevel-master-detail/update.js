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
        if(tree['step-' + count + '-list']){
            var step = tree['step-' + count + '-list'],
                fields = [],
                filters = [];

            _.forEach(step.attributes.fields, function (field) {
                var nextStep = tree['step-' + (count + 1) + '-list'];

                if (nextStep && _.includes(_.map(nextStep.attributes.filters, function(f){ return f.label }), field.label)){
                  fields.push({ label: field.label, value: field.label, type: field.type || 'text', name: field.name || '', filter: true });
                } else {
                  fields.push({ label: field.label, value: field.label, type: field.type || 'text', name: field.name || '', filter: false });
                }
            })

            var parentViewContainer = graph.attributes.cells._byId[step.attributes.parent];
            steps.push({name: parentViewContainer.attributes.name, collection: step.attributes.collection, fields: fields});

            count++;
        }
    };

    return {
        type: 'update',
        name: tree['pattern-container'].attributes.name,
        detailsName: tree['result-details'].attributes.name,
        steps: steps,
        listFields: steps[0].fields,
        detailsFields: _.map(tree['result-details'].attributes.fields, function (f) { return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
