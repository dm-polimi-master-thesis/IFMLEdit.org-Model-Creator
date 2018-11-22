// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    idValidator = require('../../../js/ifml/utilities/validator/idValidator.js').idValidator,
    toHash = require('../../../js/ifml/utilities/validator/toHash.js').toHash,
    configurator = require('../../../js/ifml/utilities/configurator/elementConfigurator.js').configurator,
    format = require('./default.json');

function parser(inPlaceLogIn){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  var editorResults = _.map(inPlaceLogIn.editor.fields, function (field) {
    return [field, { label: field.label + '-error', value: field.value + '-error', type: field.type, name: field.name }];
  });
  var logInResults = _.map(inPlaceLogIn.logIn.fields, function (field) {
    return [field, { label: field.label  + '-error', value: field.value + '-error', type: field.type, name: field.name }];
  });
  var inPlaceLogInFormFields = _.map(inPlaceLogIn.editor.fields, function (field) {
    return {
      label: field.label,
      value: field.value,
      type: 'hidden',
      name: field.name
    }
  })

  configurator(modelElementsHash['xor-view-container'], template, {
      name: inPlaceLogIn.name
  });
  configurator(modelElementsHash['editor-form'], template, {
      name: inPlaceLogIn.editor.formName,
      fields: inPlaceLogIn.editor.fields
  });
  configurator(modelElementsHash['log-in-form'], template, {
      name: inPlaceLogIn.logIn.formName,
      fields: _.flattenDeep([inPlaceLogIn.logIn.fields, inPlaceLogInFormFields])
  });
  configurator(modelElementsHash['send-action'], template, {
      parameters: inPlaceLogIn.editor.fields,
      results: _.flattenDeep(editorResults),
      parent: modelElementsHash['in-place-log-in-pattern-view-container'].id
  });
  configurator(modelElementsHash['log-in-and-send-action'], template, {
      parameters: _.flattenDeep([inPlaceLogIn.logIn.fields, inPlaceLogInFormFields]),
      results: _.flattenDeep([logInResults]),
      parent: modelElementsHash['in-place-log-in-pattern-view-container'].id
  });
  configurator(modelElementsHash['send-navigation-flow'], template, {
      fields: inPlaceLogIn.editor.fields
  });
  configurator(modelElementsHash['failed-send-navigation-flow'], template, {
      fields: inPlaceLogIn.editor.fields
  });
  configurator(modelElementsHash['in-place-log-in-navigation-flow'], template, {
      fields: inPlaceLogIn.editor.fields
  });
  configurator(modelElementsHash['log-in-navigation-flow'], template, {
      fields: _.flattenDeep([inPlaceLogIn.logIn.fields, inPlaceLogInFormFields])
  });
  configurator(modelElementsHash['failed-log-in-navigation-flow'], template, {
      fields: _.flattenDeep(logInResults)
  });

  return template;
}

exports.parser = parser;
