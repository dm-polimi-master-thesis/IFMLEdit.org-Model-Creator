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
    format = require('./default.json');

function create(inputDataValidation){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements),
      regularValues = fieldsManipulator.toRegularValues(inputDataValidation.data.fields),
      specialValues = fieldsManipulator.toSpecialValues(inputDataValidation.data.fields),
      errorValues = fieldsManipulator.toErrorValues(regularValues);

  console.log(inputDataValidation.data.fields);
  console.log(regularValues);
  console.log(specialValues);
  console.log(errorValues);

  configurator(modelElementsHash['input-data-validation-pattern-view-container'], template, {
      name: inputDataValidation.name
  });
  configurator(modelElementsHash['data-form'], template, {
      name: inputDataValidation.data.formName,
      fields: inputDataValidation.data.fields
  });
  configurator(modelElementsHash['validate-action'], template, {
      parameters: _.flattenDeep([regularValues, specialValues]),
      results: _.flattenDeep([errorValues, regularValues, specialValues]),
      parent: modelElementsHash['input-data-validation-pattern-view-container'].id
  });
  configurator(modelElementsHash['send-navigation-flow'], template, {
      fields: _.flattenDeep([regularValues, specialValues])
  });
  configurator(modelElementsHash['failed-navigation-flow'], template, {
      fields: _.flattenDeep([errorValues, regularValues, specialValues])
  });

  return template;
}

exports.create = create;
