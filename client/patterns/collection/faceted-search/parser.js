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

function parser(facetedSearch){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['xor-view-container'], template, {
      name: facetedSearch.name,
  });
  configurator(modelElementsHash['keyword-form'], template, {
      fields: facetedSearch.search,
  });
  configurator(modelElementsHash['filters-form'], template, {
      name: facetedSearch.filters.name,
      fields: facetedSearch.filters.fields
  });
  configurator(modelElementsHash['results-list'], template, {
      name: facetedSearch.list.collection.charAt(0).toUpperCase() + facetedSearch.list.collection.slice(1),
      collection: facetedSearch.list.collection,
      filters: _.flattenDeep([facetedSearch.search, facetedSearch.filters.fields]),
      fields: facetedSearch.list.fields
  });
  configurator(modelElementsHash['details-view-container'], template, {
      name: facetedSearch.details.name
  });
  configurator(modelElementsHash['selected-details'], template, {
      name: facetedSearch.details.name,
      collection: facetedSearch.list.collection,
      fields: facetedSearch.details.fields
  });
  console.log(facetedSearch.search);
  configurator(modelElementsHash['keyword-data-flow'], template, {
      fields: facetedSearch.search
  });
  configurator(modelElementsHash['filters-data-flow'], template, {
      fields: facetedSearch.filters.fields
  });

  return template;
}

exports.parser = parser;
