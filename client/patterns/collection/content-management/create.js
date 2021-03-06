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
    fieldsManipulator = require('../../../js/ifml/utilities/manipulator/fields.js').fieldsManipulator,
    format = require('./default.json');

function create(pageManagement){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  if(pageManagement.voiceCommand) {
      return template;
  }

  var regularValues = fieldsManipulator.toRegularValues(pageManagement.dataEntry.fields),
      specialValues = fieldsManipulator.toSpecialValues(pageManagement.dataEntry.fields),
      errorValues = fieldsManipulator.toErrorValues(regularValues);

  configurator(modelElementsHash['content-management-pattern-view-container'], template, {
      pattern: [{
        type: 'root',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['xor-view-container'], template, {
      name: pageManagement.name
  });
  configurator(modelElementsHash['data-entry-view-container'], template, {
      name: pageManagement.dataEntry.name
  });
  configurator(modelElementsHash['data-entry-form'], template, {
      name: pageManagement.dataEntry.name,
      fields: _.flattenDeep([{ label: 'id', value: 'id', type: 'hidden', name: '' }, pageManagement.dataEntry.fields]),
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['pages-view-container'], template, {
      name: pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1)
  });
  configurator(modelElementsHash['pages-list'], template, {
      name: pageManagement.pageListOption ? pageManagement.list.collection.charAt(0).toUpperCase() + pageManagement.list.collection.slice(1) : undefined,
      collection: pageManagement.list.collection || undefined,
      fields: pageManagement.list.fields || undefined,
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['page-display-view-container'], template, {
      name: pageManagement.details.name
  });
  configurator(modelElementsHash['page-details'], template, {
      name: pageManagement.details.name || undefined,
      collection: pageManagement.details.collection || undefined,
      fields: pageManagement.details.fields || undefined,
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['delete-page-details'], template, {
      collection: pageManagement.list.collection || undefined,
      fields: pageManagement.list.fields || undefined,
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['load-content-action'], template, {
      results: _.flattenDeep([{ label: 'id', value: 'id', type: 'hidden', name: '' }, regularValues, specialValues]),
      parent: modelElementsHash['xor-view-container'].id,
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['create-modify-action'], template, {
      parameters: _.flattenDeep([{ label: 'id' }, regularValues, specialValues]),
      results: _.flattenDeep([{ label: 'id' }, errorValues, regularValues, specialValues]),
      parent: modelElementsHash['xor-view-container'].id,
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  configurator(modelElementsHash['delete-action'], template, {
      pattern: [{
        type: 'node',
        value: 'content management'
      }]
  });
  console.log(specialValues);
  console.log(regularValues);
  configurator(modelElementsHash['details-to-modify-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id' }, regularValues, specialValues])
  });
  configurator(modelElementsHash['done-load-content-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id' }, regularValues, specialValues])
  });
  configurator(modelElementsHash['submit-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id' }, regularValues, specialValues])
  });
  configurator(modelElementsHash['failed-submit-navigation-flow'], template, {
      fields: _.flattenDeep([{ label: 'id' }, errorValues, regularValues, specialValues])
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

exports.create = create;
