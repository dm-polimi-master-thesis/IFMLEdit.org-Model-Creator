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
    format = require('./default.json');

function create(restrictedSearch){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  if(restrictedSearch.voiceCommand) {
      return template;
  }

  configurator(modelElementsHash['restricted-search-pattern-view-container'], template, {
      pattern: [{
        type: 'root',
        value: 'restricted search'
      }]
  });
  configurator(modelElementsHash['xor-view-container'], template, {
      name: restrictedSearch.name,
  });
  configurator(modelElementsHash['keyword-form'], template, {
      fields: restrictedSearch.search,
      pattern: [{
        type: 'node',
        value: 'restricted search'
      }]
  });
  configurator(modelElementsHash['results-list'], template, {
      name: restrictedSearch.list.collection.charAt(0).toUpperCase() + restrictedSearch.list.collection.slice(1),
      collection: restrictedSearch.list.collection,
      filters: [restrictedSearch.filter, restrictedSearch.search[0]],
      fields: restrictedSearch.list.fields,
      pattern: [{
        type: 'node',
        value: 'restricted search'
      }]
  });
  configurator(modelElementsHash['category-list'], template, {
      name: restrictedSearch.filter.charAt(0).toUpperCase() + restrictedSearch.filter.slice(1),
      collection: "categories",
      fields: [{ label:restrictedSearch.filter }],
      pattern: [{
        type: 'node',
        value: 'restricted search'
      }]
  });
  configurator(modelElementsHash['product-view-container'], template, {
      name: restrictedSearch.details.name
  });
  configurator(modelElementsHash['product-details'], template, {
      name: restrictedSearch.details.name.charAt(0).toUpperCase() + restrictedSearch.details.name.slice(1),
      collection: restrictedSearch.list.collection,
      fields: restrictedSearch.details.fields,
      pattern: [{
        type: 'node',
        value: 'restricted search'
      }]
  });
  configurator(modelElementsHash['keyword-data-flow'], template, {
      fields: restrictedSearch.search
  });
  configurator(modelElementsHash['filter-data-flow'], template, {
      fields: [{ label:restrictedSearch.filter }]
  });

  return template;
}

exports.create = create;
