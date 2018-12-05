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
    delator = require('../../../js/ifml/utilities/delator/elementDelator.js').delator,
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
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, pageManagement.dataEntry.fields])
  });
  configurator(modelElementsHash['pages-view-container'], template, {
      name: pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1)
  });
  configurator(modelElementsHash['pages-list'], template, {
      name: pageManagement.pageListOption ? pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1) : undefined,
      collection: pageManagement.list.collection || undefined,
      fields: pageManagement.list.fields || undefined
  });
  configurator(modelElementsHash['page-display-view-container'], template, {
      name: pageManagement.details.name
  });
  configurator(modelElementsHash['page-details'], template, {
      name: pageManagement.details.name || undefined,
      collection: pageManagement.details.collection || undefined,
      fields: pageManagement.details.fields || undefined
  });
  configurator(modelElementsHash['delete-page-details'], template, {
      collection: pageManagement.details.collection || undefined,
      fields: pageManagement.details.fields || undefined
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
  configurator(modelElementsHash['details-to-modify-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'text', name: '' }, pageManagement.dataEntry.fields])
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

  if (!pageManagement.pageListOption) {
      var ids = [
        modelElementsHash['pages-view-container'].id,
        modelElementsHash['pages-list'].id,
        modelElementsHash['delete-event'].id,
        modelElementsHash['modify-event'].id,
        modelElementsHash['display-event'].id,
        modelElementsHash['display-navigation-flow'].id,
        modelElementsHash['modify-navigation-flow'].id,
        modelElementsHash['delete-navigation-flow'].id,
        modelElementsHash['done-delete-navigation-flow'].id,
        modelElementsHash['done-delete-event'].id,
        modelElementsHash['delete-confirmation-navigation-flow'].id,
        modelElementsHash['delete-page-details'].id,
        modelElementsHash['delete-confirmation-event'].id,
        modelElementsHash['cancel-confirmation-event'].id,
        modelElementsHash['cancel-confirmation-navigation-flow'].id,
        modelElementsHash['failed-load-content-navigation-flow'].id,
        modelElementsHash['failed-load-content-event'].id,
        modelElementsHash['load-content-action'].id,
        modelElementsHash['done-load-content-event'].id,
        modelElementsHash['done-load-content-navigation-flow'].id,
        modelElementsHash['modal-confirmation-view-container'].id,
        modelElementsHash['delete-action'].id
      ];

      delator(ids,template);
  }

  if (!pageManagement.dataOption) {
      var ids = [
        modelElementsHash['data-entry-view-container'].id,
        modelElementsHash['data-entry-form'].id,
        modelElementsHash['submit-event'].id,
        modelElementsHash['submit-navigation-flow'].id,
        modelElementsHash['create-modify-action'].id,
        modelElementsHash['failed-create-modify-event'].id,
        modelElementsHash['failed-submit-navigation-flow'].id,
        modelElementsHash['done-create-modify-event'].id,
        modelElementsHash['done-create-modify-navigation-flow'].id,
        modelElementsHash['modify-page-event'].id,
        modelElementsHash['details-to-modify-navigation-flow'].id,
        modelElementsHash['load-content-action'].id,
        modelElementsHash['done-load-content-event'].id,
        modelElementsHash['done-load-content-navigation-flow'].id,
        modelElementsHash['failed-load-content-event'].id,
        modelElementsHash['failed-load-content-navigation-flow'].id,
        modelElementsHash['modify-event'].id,
        modelElementsHash['modify-navigation-flow'].id
      ];

      delator(ids,template);
  }

  if (!pageManagement.detailsOption) {
      var ids = [
        modelElementsHash['page-display-view-container'].id,
        modelElementsHash['page-details'].id,
        modelElementsHash['modify-page-event'].id,
        modelElementsHash['details-to-modify-navigation-flow'].id,
        modelElementsHash['done-create-modify-navigation-flow'].id,
        modelElementsHash['display-event'].id,
        modelElementsHash['display-navigation-flow'].id
      ];

      delator(ids,template);
  }

  return template;
}

exports.parser = parser;
