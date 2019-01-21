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
                nextStep = tree['step-' + (count + 1) + '-list'],
                fields = [],
                filters = [];

            console.log(step);
            _.forEach(step.attributes.fields, function (field) {
                if (nextStep && _.includes(nextStep.attributes.filters, field)){
                  fields.push({ label: filter.label, value: filter.label, type: filter.type || 'text', name: filter.name || '', filter: true }),
                  filters.push(filter.label);
                } else {
                  fields.push({ label: field.label, value: field.label, type: field.type || 'text', name: field.name || '', filter: false });
                }
            })

            //_.chain(step.attributes.fields)
            // .filter (function (field) { return  !_.includes(filters,field.label)})
            // .forEach(function (field) {
            //      fields.push({ label: field.label, value: field.label, type: field.type || 'text', name: field.name || '', filter: false });
            // })
            console.log(count);
            console.log(fields);
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
        detailsFields: _.map(tree['result-details'].fields, function (f) { return { label: f.label, value: f.label, type: f.type || 'text', name: f.name || '' }})
    }
}

exports.update = update;
