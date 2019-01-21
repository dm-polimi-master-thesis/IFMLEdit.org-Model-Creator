// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        editorRegularValues = tree['editor-form'] ? fieldsManipulator.toRegularValues(template.editor.fields) : undefined,
        editorSpecialValues = tree['editor-form'] ? fieldsManipulator.toSpecialValues(template.editor.fields) : undefined,
        editorErrorValues = tree['editor-form'] ? fieldsManipulator.toErrorValues(editorRegularValues) : undefined,
        logInRegularValues = fieldsManipulator.toRegularValues(template.logIn.fields),
        logInSpecialValues = fieldsManipulator.toSpecialValues(template.logIn.fields),
        logInErrorValues = fieldsManipulator.toErrorValues(logInRegularValues),
        contentToSend = { label: 'content-to-send', value: '', type: 'hidden-object', name: '' };

    tree['pattern-container'].prop('name', template.name);
    tree['log-in-form'].prop('name', template.logIn.formName);
    tree['log-in-form'].attributes.fields = template.logIn.fields;
    tree['log-in-send-action'].attributes.parameters = _.flattenDeep([logInRegularValues, logInSpecialValues, { label: contentToSend.label }]);
    tree['log-in-send-action'].attributes.results = _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues, { label: contentToSend.label }]);
    tree['log-in-send-flow'].attributes.bindings = _.map(_.flattenDeep([logInRegularValues, logInSpecialValues, { label: contentToSend.label }]), function (f) {return {input: f.label, output: f.label}});
    tree['failed-log-in-send-flow'].attributes.bindings = _.map(_.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues, { label: contentToSend.label }]), function (f) {return {input: f.label, output: f.label}});


    if(tree['editor-form']){
        tree['editor-form'].prop('name',template.editor.formName);
        tree['editor-form'].attributes.fields = template.editor.fields;
        tree['content-send-action'].attributes.parameters = _.flattenDeep([editorRegularValues, editorSpecialValues]);
        tree['content-send-action'].attributes.results = _.flattenDeep([editorErrorValues, editorRegularValues, editorSpecialValues, { label: contentToSend.label }]);
        tree['editor-flow'].attributes.bindings = _.map(_.flattenDeep([editorRegularValues, editorSpecialValues]), function (f) {return {input: f.label, output: f.label}});
        tree['failed-editor-flow'].attributes.bindings = _.map(_.flattenDeep([editorErrorValues, editorRegularValues, editorSpecialValues]), function (f) {return {input: f.label, output: f.label}});
        tree['log-in-flow'].attributes.bindings = _.map(_.flattenDeep([editorRegularValues, editorSpecialValues]), function (f) {return {input: f.label, output: f.label}});
    }
}

exports.load = load;
