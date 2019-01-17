// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    idValidator = require('../../../js/ifml/utilities/validator/idValidator.js').idValidator,
    toHash = require('../../../js/ifml/utilities/validator/toHash.js').toHash,
    configurator = require('../../../js/ifml/utilities/configurator/elementConfigurator.js').configurator,
    generator = require('../../../js/ifml/utilities/generator/elementGenerator.js').generator,
    graphBuilder = require('../../utilities/graphBuilder.js').graphBuilder,
    format = require('./default.json');

function create(alphabeticalFilter){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['xor-view-container'], template, {
      name: alphabeticalFilter.name
  });
  configurator(modelElementsHash['alphabetical-filter-list'], template, {
      name: alphabeticalFilter.filter.collection.charAt(0).toUpperCase() + alphabeticalFilter.filter.collection.slice(1),
      collection: alphabeticalFilter.filter.collection,
      fields: alphabeticalFilter.filter.fields
  });
  configurator(modelElementsHash['results-list'], template, {
      name: alphabeticalFilter.list.collection.charAt(0).toUpperCase() + alphabeticalFilter.list.collection.slice(1),
      collection: alphabeticalFilter.list.collection,
      filters: alphabeticalFilter.filter.fields,
      fields: alphabeticalFilter.list.fields
  });
  configurator(modelElementsHash['result-view-container'], template, {
      name: alphabeticalFilter.details.name
  });
  configurator(modelElementsHash['result-details'], template, {
      name: alphabeticalFilter.details.name,
      collection: alphabeticalFilter.list.collection,
      fields: alphabeticalFilter.details.fields
  });
  configurator(modelElementsHash['filter-to-results-navigation-flow'], template, {
      fields: alphabeticalFilter.filter.fields
  });
  configurator(modelElementsHash['alphabetical-filter-pattern-view-container'], template, {
      pattern: {
        role: 'pattern-container',
        priority: 'high',
        active: 'true'
      }
  });

  return template;
}

exports.create = create;
