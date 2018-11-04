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

function parser(multilevelMasterDetail){
  var template = _.cloneDeep(format),
      modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['multilevel-master-detail-pattern-view-container'], template, {
      size: {
        height: modelElementsHash['multilevel-master-detail-pattern-view-container'].metadata.graphics.size.height,
        width: modelElementsHash['multilevel-master-detail-pattern-view-container'].metadata.graphics.size.width + 250 * (multilevelMasterDetail.steps.length - 2)
      }
  });
  configurator(modelElementsHash['xor-view-container'], template, {
      name: multilevelMasterDetail.name,
      size: {
        height: modelElementsHash['xor-view-container'].metadata.graphics.size.height,
        width: modelElementsHash['xor-view-container'].metadata.graphics.size.width + 250 * (wizard.steps.length - 2)
      }
  });

  _.slice(multilevelMasterDetail.steps, 0, 2)
   .forEach(function(step, index, collection){
     configurator(modelElementsHash['step-' + (index + 1) + '-view-container'], template, {
         name: step.name
     });
     configurator(modelElementsHash['step-' + (index + 1) + '-list'], template, {
         name: step.collection.charAt(0).toUpperCase() + step.collection.slice(1),
         collection: step.collection,
         fields: step.fields,
         filters: step.filters
     });
     configurator(modelElementsHash['selected-step-' + (index + 1) + '-navigation-flow'], template, {
         name: 'Next ' + step.name,
         fields: step.fields
     });
     configurator(modelElementsHash['ok-validate-step-' + (index + 1) + '-navigation-flow'], template, {
         name: 'Ok Validate ' + step.name
     });
     configurator(modelElementsHash['ko-validate-step-' + (index + 1) + '-navigation-flow'], template, {
         name: 'Ko Validate ' + step.name,
         fields: _.flattenDeep(errorFields)
     });
     configurator(modelElementsHash['to-step-' + (index + 1) + '-navigation-flow'], template, {
         name: 'To ' + step.name,
         fields: step.fields
     });
     if(index === 1){
       configurator(modelElementsHash['previous-step-' + (index + 1) + '-navigation-flow'], template, {
           name: 'Previous ' + step.name,
           fields: step.fields
       });
     }
  });



  configurator(modelElementsHash['categories-list-view-container'], template, {
      name: multilevelMasterDetail.steps[0].collection.charAt(0).toUpperCase() + multilevelMasterDetail.steps[0].collection.slice(1)
  });
  configurator(modelElementsHash['categories-list-view-container'], template, {
      name: multilevelMasterDetail.steps[0].collection.charAt(0).toUpperCase() + multilevelMasterDetail.steps[0].collection.slice(1)
  });
  configurator(modelElementsHash['mail-list'], template, {
      name: multilevelMasterDetail.list.collection.charAt(0).toUpperCase() + multilevelMasterDetail.list.collection.slice(1),
      collection: multilevelMasterDetail.list.collection,
      fields: multilevelMasterDetail.list.fields
  });
  configurator(modelElementsHash['mail-details-view-container'], template, {
      name: multilevelMasterDetail.details.name.charAt(0).toUpperCase() + multilevelMasterDetail.details.name.slice(1)
  });
  configurator(modelElementsHash['mail-details'], template, {
      name: multilevelMasterDetail.details.name.charAt(0).toUpperCase() + multilevelMasterDetail.details.name.slice(1),
      collection: multilevelMasterDetail.list.collection,
      fields: multilevelMasterDetail.details.fields
  });

  return template;
}

exports.parser = parser;
