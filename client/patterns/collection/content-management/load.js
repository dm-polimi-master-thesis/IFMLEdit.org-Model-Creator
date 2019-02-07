// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        regularValues = fieldsManipulator.toRegularValues(template.dataEntry.fields),
        specialValues = fieldsManipulator.toSpecialValues(template.dataEntry.fields),
        errorValues = fieldsManipulator.toErrorValues(regularValues);

    tree['pattern-container'].prop('name',template.name);
    if(tree['data-entry-form']){
        tree['data-entry-form'].prop('name',template.name);
        tree['data-entry-form'].attributes.fields = template.dataEntry.fields;
        tree['save-data-entry-flow'].prop('bindings', _.map(_.flattenDeep([{ label: 'id' }, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
        tree['save-action'].attributes.parameters = _.flattenDeep([{ label: 'id' }, regularValues, specialValues]);
        tree['save-action'].attributes.results = _.flattenDeep([{ label: 'id' }, errorValues, regularValues, specialValues]);
    }
    if(tree['page-details']){
        tree['page-details'].prop('name',template.name);
        tree['page-details'].prop('collection',template.details.collection);
        tree['page-details'].attributes.fields = template.details.fields;
    }
    if(tree['page-list']){
        tree['page-list'].prop('collection',template.list.collection);
        tree['page-list'].attributes.fields = template.list.fields;
    }
    if(tree['load-content-action']){
        tree['load-content-action'].attributes.results = _.flattenDeep([{ label: 'id', value: 'id', type: 'hidden', name: '' }, regularValues, specialValues]);
        tree['load-data-entry-flow'].prop('bindings', _.map(_.flattenDeep([{ label: 'id' }, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
    }
    if(tree['failed-data-entry-flow']){
        tree['failed-data-entry-flow'].prop('bindings', _.map(_.flattenDeep([{ label: 'id' }, errorValues, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
    }
    if(tree['modify-flow']){
        tree['modify-flow'].prop('bindings', _.map(_.flattenDeep([{ label: 'id' }, regularValues, specialValues]), function (f) {return {input: f.label, output: f.label}}));
    }
}

exports.load = load;
