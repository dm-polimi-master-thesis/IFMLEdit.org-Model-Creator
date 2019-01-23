// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator;;

function load(template,cell) {
    var tree = cell.attributes.pattern[0].tree,
        logInRegularValues = fieldsManipulator.toRegularValues(template.logIn.fields),
        logInSpecialValues = fieldsManipulator.toSpecialValues(template.logIn.fields),
        logInErrorValues = fieldsManipulator.toErrorValues(logInRegularValues),
        signUpRegularValues = fieldsManipulator.toRegularValues(template.signUp.fields),
        signUpSpecialValues = fieldsManipulator.toSpecialValues(template.signUp.fields),
        signUperrorValues = fieldsManipulator.toErrorValues(signUpRegularValues);

    tree['pattern-container'].prop('name',template.name);
    tree['log-in-form'].prop('name',template.logIn.formName);
    tree['log-in-form'].attributes.fields = template.logIn.fields;
    tree['sign-up-form'].prop('name',template.signUp.formName);
    tree['sign-up-form'].attributes.fields = template.signUp.fields;
    tree['log-in-action'].attributes.parameters = _.flattenDeep([logInRegularValues, logInSpecialValues]);
    tree['log-in-action'].attributes.results = _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues]);
    tree['log-in-flow'].attributes.bindings = _.map(_.flattenDeep([logInRegularValues, logInSpecialValues]), function (f) {return {input: f.label, output: f.label}});
    tree['failed-log-in-flow'].attributes.bindings = _.map(_.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues]), function (f) {return {input: f.label, output: f.label}});
    tree['sign-up-action'].attributes.parameters = _.flattenDeep([signUpRegularValues, signUpSpecialValues]);
    tree['sign-up-action'].attributes.results = _.flattenDeep([signUperrorValues, signUpRegularValues, signUpSpecialValues]);
    tree['sign-up-flow'].attributes.bindings = _.map(_.flattenDeep([signUpRegularValues, signUpSpecialValues]), function (f) {return {input: f.label, output: f.label}});
    tree['failed-sign-up-flow'].attributes.bindings = _.map(_.flattenDeep([signUperrorValues, signUpRegularValues, signUpSpecialValues]), function (f) {return {input: f.label, output: f.label}});
}

exports.load = load;
