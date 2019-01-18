// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree;

    tree['pattern-container'].attributes.name = template.name;
    if(tree['data-entry-form']){
        tree['data-entry-form'].attributes.name = template.dataEntry.name;
        tree['data-entry-form'].attributes.fields = template.dataEntry.fields;
        tree['save-data-entry-flow'].attributes.bindings = _.map(template.dataEntry.fields, function (f) {return {input: f.label, output: f.label}});
        tree['save-action'].attributes.parameters = template.dataEntry.fields;
    }
    if(tree['page-details']){
        tree['page-details'].attributes.name = template.details.name;
        tree['page-details'].attributes.collection = template.details.collection;
        tree['page-details'].attributes.fields = template.details.fields;
    }
    if(tree['page-list']){
        tree['page-list'].attributes.collection = template.list.collection;
        tree['page-list'].attributes.fields = template.list.fields;
    }
    if(tree['load-content-action']){
        tree['load-content-action'].attributes.results = template.dataEntry.fields;
        tree['load-data-entry-flow'].attributes.bindings = _.map(template.dataEntry.fields, function (f) {return {input: f.label, output: f.label}});
    }
    if(tree['failed-data-entry-flow']){
        tree['failed-data-entry-flow'].attributes.bindings = _.map(template.dataEntry.fields, function (f) {return {input: f.label, output: f.label}});
    }
    if(tree['modify-flow']){
        tree['modify-flow'].attributes.bindings = _.map(template.dataEntry.fields, function (f) {return {input: f.label, output: f.label}});
    }
}

exports.load = load;
