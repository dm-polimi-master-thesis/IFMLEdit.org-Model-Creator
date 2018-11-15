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

function parser(signUpLogIn){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  var signUpResults = _.map(signUpLogIn.signUp.fields, function (field) {
    return [field, field + '-error'];
  });
  var logInResults = _.map(signUpLogIn.logIn.fields, function (field) {
    return [field, field + '-error'];
  });

  configurator(modelElementsHash['xor-view-container'], template, {
      name: signUpLogIn.name
  });
  configurator(modelElementsHash['sign-up-form'], template, {
      name: signUpLogIn.signUp.formName,
      fields: signUpLogIn.signUp.fields
  });
  configurator(modelElementsHash['log-in-form'], template, {
      name: signUpLogIn.logIn.formName,
      fields: signUpLogIn.logIn.fields
  });
  configurator(modelElementsHash['registration-action'], template, {
      parameters: signUpLogIn.signUp.fields,
      results: _.flattenDeep(signUpResults),
      parent: modelElementsHash['sign-up-and-log-in-pattern-view-container'].id
  });
  configurator(modelElementsHash['log-in-action'], template, {
      parameters: signUpLogIn.logIn.fields,
      results: _.flattenDeep(logInResults),
      parent: modelElementsHash['sign-up-and-log-in-pattern-view-container'].id
  });
  configurator(modelElementsHash['registration-navigation-flow'], template, {
      fields: _.flattenDeep(signUpLogIn.signUp.fields)
  });
  configurator(modelElementsHash['failed-registration-navigation-flow'], template, {
      fields: _.flattenDeep(signUpResults)
  });
  configurator(modelElementsHash['log-in-navigation-flow'], template, {
      fields: _.flattenDeep(signUpLogIn.logIn.fields)
  });
  configurator(modelElementsHash['failed-log-in-navigation-flow'], template, {
      fields: _.flattenDeep(logInResults)
  });

  return template;
}

exports.parser = parser;
