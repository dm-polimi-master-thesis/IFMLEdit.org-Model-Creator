// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        graph = cell.graph,
        steps = template.steps,
        count = template.steps.length;

    tree['pattern-container'].prop('name',template.name);

    while (count >= 1) {
        var parentViewContainer = graph.getCell(tree['step-' + count + '-form'].attributes.parent),
            regularValues = fieldsManipulator.toRegularValues(template.steps[count-1].fields),
            specialValues = fieldsManipulator.toSpecialValues(template.steps[count-1].fields),
            errorValues = fieldsManipulator.toErrorValues(regularValues);

        parentViewContainer.prop('name',steps[count-1].name);

        tree['step-' + count + '-form'].prop('name',steps[count-1].formName);
        tree['step-' + count + '-form'].attributes.fields = steps[count-1].fields;
        tree['validate-step-' + count + '-action'].attributes.parameters = _.flattenDeep([regularValues, specialValues]);
        tree['validate-step-' + count + '-action'].attributes.results = _.flattenDeep([errorValues, regularValues, specialValues]);
        tree['validate-step-' + count + '-flow'].attributes.bindings = _.map(_.flattenDeep([regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}});
        tree['failed-validate-step-' + count + '-flow'].attributes.bindings = _.map(_.flattenDeep([errorValues, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}});
        tree['previous-step-' + count + '-action'].attributes.results = _.flattenDeep([regularValues, specialValues]);
        tree['to-step-' + count + '-flow'].attributes.bindings = _.map(_.flattenDeep([regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}});
        if (count !== 1) {
            tree['previous-step-' + count + '-flow'].attributes.bindings = _.map(_.flattenDeep([regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}});
        }

        if (count < steps.length) {
            var nextRegularValues = fieldsManipulator.toRegularValues(template.steps[count].fields),
                nextSpecialValues = fieldsManipulator.toSpecialValues(template.steps[count].fields)

            tree['previous-step-' + count + '-action'].attributes.parameters = _.flattenDeep([nextRegularValues,nextSpecialValues]);

            if (count !== 1) {
                tree['previous-step-' + count + '-flow'].attributes.parameters = _.flattenDeep([nextRegularValues,nextSpecialValues]);
            }
        }

        count--;
    }
}

exports.load = load;
