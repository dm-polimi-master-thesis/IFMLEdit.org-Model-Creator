// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        regularValues = fieldsManipulator.toRegularValues(template.data.fields),
        specialValues = fieldsManipulator.toSpecialValues(template.data.fields),
        errorValues = fieldsManipulator.toErrorValues(regularValues);

    tree['pattern-container'].prop('name', template.name);
    tree['data-entry-form'].prop('name', template.data.formName);
    tree['data-entry-form'].attributes.fields = template.data.fields;
    tree['validate-action'].attributes.parameters = _.flattenDeep([regularValues, specialValues]);
    tree['validate-action'].attributes.results = _.flattenDeep([errorValues, regularValues, specialValues]);
    tree['validate-flow'].prop('bindings', _.map(_.flattenDeep([regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
    tree['failed-validate-flow'].prop('bindings', _.map(_.flattenDeep([errorValues, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
}

exports.load = load;
