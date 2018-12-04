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

function parser(pageManagement){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  var dataResults = _.map(pageManagement.dataEntry.fields, function (field) {
    return [field, { label: field.label + '-error', value: field.value + '-error', type: field.type, name: field.name }];
  });

  configurator(modelElementsHash['xor-view-container'], template, {
      name: pageManagement.name
  });
  configurator(modelElementsHash['data-entry-view-container'], template, {
      name: pageManagement.dataEntry.name
  });
  configurator(modelElementsHash['data-entry-form'], template, {
      name: pageManagement.dataEntry.name,
      fields: pageManagement.dataEntry.fields
  });
  configurator(modelElementsHash['pages-view-container'], template, {
      name: pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1)
  });
  configurator(modelElementsHash['pages-list'], template, {
      name: pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1),
      collection: pageManagement.list.collection,
      fields: pageManagement.list.fields
  });
  configurator(modelElementsHash['page-display-view-container'], template, {
      name: pageManagement.details.name
  });
  configurator(modelElementsHash['page-details'], template, {
      name: pageManagement.details.name,
      collection: pageManagement.list.collection,
      fields: pageManagement.details.fields
  });
  configurator(modelElementsHash['delete-page-details'], template, {
      collection: pageManagement.list.collection,
      fields: pageManagement.details.fields
  });
  configurator(modelElementsHash['load-content-action'], template, {
      results: _.flattenDeep([{ label: 'id', value: 'id', type: 'hidden', name: '' }, pageManagement.dataEntry.fields]),
      parent: modelElementsHash['xor-view-container'].id
  });
  configurator(modelElementsHash['create-modify-action'], template, {
      parameters: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, pageManagement.dataEntry.fields]),
      results: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, dataResults]),
      parent: modelElementsHash['xor-view-container'].id
  });
  configurator(modelElementsHash['done-load-content-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, pageManagement.dataEntry.fields])
  });
  configurator(modelElementsHash['submit-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, pageManagement.dataEntry.fields])
  });
  configurator(modelElementsHash['failed-submit-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, dataResults])
  });

  return template;
}

exports.parser = parser;
