// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    idValidator = require('../../../js/ifml/utilities/validator/idValidator.js').idValidator,
    toHash = require('../../../js/ifml/utilities/validator/toHash.js').toHash,
    configurator = require('../../../js/ifml/utilities/configurator/elementConfigurator.js').configurator,
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator,
    format = require('./default.json'),
    editor = require('./editor.json');

function create(inPlaceLogIn){
  var template = inPlaceLogIn.editorOption ? _.cloneDeep(editor) : _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  if(inPlaceLogIn.voiceCommand) {
      return template;
  }

  var editorRegularValues = fieldsManipulator.toRegularValues(inPlaceLogIn.editor.fields),
      editorSpecialValues = fieldsManipulator.toSpecialValues(inPlaceLogIn.editor.fields),
      editorErrorValues = fieldsManipulator.toErrorValues(editorRegularValues),
      logInRegularValues = fieldsManipulator.toRegularValues(inPlaceLogIn.logIn.fields),
      logInSpecialValues = fieldsManipulator.toSpecialValues(inPlaceLogIn.logIn.fields),
      logInErrorValues = fieldsManipulator.toErrorValues(logInRegularValues),
      contentToSend = {
        label: 'content-to-send',
        value: '',
        type: 'hidden-object',
        name: ''
      };

  configurator(modelElementsHash['in-place-log-in-pattern-view-container'], template, {
      name: inPlaceLogIn.logIn.formName,
      fields: _.flattenDeep([inPlaceLogIn.logIn.fields, contentToSend]),
      pattern: [{
        type: 'root',
        value: 'in-place log in'
      }]
  });
  configurator(modelElementsHash['log-in-form'], template, {
      name: inPlaceLogIn.logIn.formName,
      fields: _.flattenDeep([inPlaceLogIn.logIn.fields, contentToSend]),
      pattern: [{
        type: 'node',
        value: 'in-place log in'
      }]
  });
  configurator(modelElementsHash['log-in-and-send-action'], template, {
      parameters: _.flattenDeep([logInRegularValues, logInSpecialValues, { label: contentToSend.label }]),
      results: _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues, { label: contentToSend.label }]),
      parent: modelElementsHash['in-place-log-in-pattern-view-container'].id,
      pattern: [{
        type: 'node',
        value: 'in-place log in'
      }]
  });
  configurator(modelElementsHash['log-in-navigation-flow'], template, {
      fields: _.flattenDeep([logInRegularValues, logInSpecialValues, contentToSend])
  });
  configurator(modelElementsHash['failed-log-in-navigation-flow'], template, {
      fields: _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues, { label: contentToSend.label }])
  });

  if (inPlaceLogIn.editorOption) {
    configurator(modelElementsHash['editor-form'], template, {
        name: inPlaceLogIn.editor.formName,
        fields: inPlaceLogIn.editor.fields,
        pattern: [{
          type: 'node',
          value: 'in-place log in'
        }]
    });
    configurator(modelElementsHash['send-action'], template, {
        parameters: _.flattenDeep([editorRegularValues, editorSpecialValues]),
        results: _.flattenDeep([editorErrorValues, editorRegularValues, editorSpecialValues, { label: contentToSend.label }]),
        parent: modelElementsHash['in-place-log-in-pattern-view-container'].id,
        pattern: [{
          type: 'node',
          value: 'in-place log in'
        }]
    });
    configurator(modelElementsHash['send-navigation-flow'], template, {
        fields: _.flattenDeep([editorRegularValues, editorSpecialValues])
    });
    configurator(modelElementsHash['failed-send-navigation-flow'], template, {
        fields: _.flattenDeep([editorErrorValues, editorRegularValues, editorSpecialValues])
    });
    configurator(modelElementsHash['in-place-log-in-navigation-flow'], template, {
        fields: [contentToSend]
    });
    configurator(modelElementsHash['xor-view-container'], template, {
        name: inPlaceLogIn.name
    });
  } else {
    configurator(modelElementsHash['in-place-log-in-pattern-view-container'], template, {
        name: inPlaceLogIn.name
    });
  }

  return template;
}

exports.create = create;
