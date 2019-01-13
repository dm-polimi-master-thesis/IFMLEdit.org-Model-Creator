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

function create(basicSearch){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['xor-view-container'], template, {
      name: basicSearch.name,
  });
  configurator(modelElementsHash['keyword-form'], template, {
      fields: basicSearch.search,
  });
  configurator(modelElementsHash['results-list'], template, {
      name: basicSearch.list.collection.charAt(0).toUpperCase() + basicSearch.list.collection.slice(1),
      collection: basicSearch.list.collection,
      filters: basicSearch.search,
      fields: basicSearch.list.fields
  });
  configurator(modelElementsHash['product-view-container'], template, {
      name: basicSearch.details.name
  });
  configurator(modelElementsHash['product-details'], template, {
      name: basicSearch.details.name,
      collection: basicSearch.list.collection,
      fields: basicSearch.details.fields
  });
  configurator(modelElementsHash['keyword-data-flow'], template, {
      fields: basicSearch.search
  });

  return template;
}

exports.create = create;
