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

function parser(inputDataValidation){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  var dataResults = _.map(inputDataValidation.data.fields, function (field) {
    return [field.value, field.value + '-error'];
  });

  configurator(modelElementsHash['xor-view-container'], template, {
      name: inputDataValidation.name
  });
  configurator(modelElementsHash['data-form'], template, {
      name: inputDataValidation.data.formName,
      fields: inputDataValidation.data.fields
  });
  configurator(modelElementsHash['validate-action'], template, {
      parameters: _.map(inputDataValidation.data.fields,'value'),
      results: _.flattenDeep(dataResults),
      parent: modelElementsHash['input-data-validation-pattern-view-container'].id
  });
  configurator(modelElementsHash['send-navigation-flow'], template, {
      fields: _.map(inputDataValidation.data.fields,'value')
  });
  configurator(modelElementsHash['failed-navigation-flow'], template, {
      fields: _.flattenDeep(dataResults)
  });

  return template;
}

exports.parser = parser;
