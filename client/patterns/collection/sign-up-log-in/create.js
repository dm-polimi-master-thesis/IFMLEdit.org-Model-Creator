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
    logOut = require('./log-out.json');

function create(signUpLogIn){
  var template = signUpLogIn.logOut ? _.cloneDeep(logOut) : _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  if(signUpLogIn.voiceCommand) {
      return template;
  }

  var signUpRegularValues = fieldsManipulator.toRegularValues(signUpLogIn.signUp.fields),
      signUpSpecialValues = fieldsManipulator.toSpecialValues(signUpLogIn.signUp.fields),
      signUpErrorValues = fieldsManipulator.toErrorValues(signUpRegularValues),
      logInRegularValues = fieldsManipulator.toRegularValues(signUpLogIn.logIn.fields),
      logInSpecialValues = fieldsManipulator.toSpecialValues(signUpLogIn.logIn.fields),
      logInErrorValues = fieldsManipulator.toErrorValues(logInRegularValues);

  if(signUpLogIn.voiceCommand) {
      return template;
  }

  configurator(modelElementsHash['sign-up-and-log-in-pattern-view-container'], template, {
      pattern: [{
        type: 'root',
        value: 'sign up and log in'
      }]
  });
  configurator(modelElementsHash['xor-view-container'], template, {
      name: signUpLogIn.name
  });
  configurator(modelElementsHash['sign-up-form'], template, {
      name: signUpLogIn.signUp.formName,
      fields: signUpLogIn.signUp.fields,
      pattern: [{
        type: 'node',
        value: 'sign up and log in',
        state: 'sign up'
      }]
  });
  configurator(modelElementsHash['log-in-form'], template, {
      name: signUpLogIn.logIn.formName,
      fields: signUpLogIn.logIn.fields,
      pattern: [{
        type: 'node',
        value: 'sign up and log in',
        state: 'log in'
      }]
  });
  configurator(modelElementsHash['registration-action'], template, {
      parameters: _.flattenDeep([signUpRegularValues, signUpSpecialValues]),
      results: _.flattenDeep([signUpErrorValues, signUpRegularValues, signUpSpecialValues]),
      parent: modelElementsHash['sign-up-and-log-in-pattern-view-container'].id,
      pattern: [{
        type: 'node',
        value: 'sign up and log in'
      }]
  });
  configurator(modelElementsHash['log-in-action'], template, {
      parameters: _.flattenDeep([logInRegularValues, logInSpecialValues]),
      results: _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues]),
      parent: modelElementsHash['sign-up-and-log-in-pattern-view-container'].id,
      pattern: [{
        type: 'node',
        value: 'sign up and log in'
      }]
  });
  configurator(modelElementsHash['registration-navigation-flow'], template, {
      fields: _.flattenDeep([signUpRegularValues, signUpSpecialValues])
  });
  configurator(modelElementsHash['failed-registration-navigation-flow'], template, {
      fields: _.flattenDeep([signUpErrorValues, signUpRegularValues, signUpSpecialValues])
  });
  configurator(modelElementsHash['log-in-navigation-flow'], template, {
      fields: _.flattenDeep([logInRegularValues, logInSpecialValues])
  });
  configurator(modelElementsHash['failed-log-in-navigation-flow'], template, {
      fields: _.flattenDeep([logInErrorValues, logInRegularValues, logInSpecialValues])
  });

  return template;
}

exports.create = create;
