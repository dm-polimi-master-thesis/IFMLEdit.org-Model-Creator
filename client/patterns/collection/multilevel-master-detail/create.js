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

function create(multilevelMasterDetail){
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
        width: modelElementsHash['xor-view-container'].metadata.graphics.size.width + 250 * (multilevelMasterDetail.steps.length - 2)
      }
  });
  configurator(modelElementsHash['final-details'], template, {
      name: multilevelMasterDetail.details.name.charAt(0).toUpperCase() + multilevelMasterDetail.details.name.slice(1),
      collection: multilevelMasterDetail.steps[multilevelMasterDetail.steps.length - 1].collection,
      fields: multilevelMasterDetail.details.fields
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
         filters: index === 1 ? collection[0].filters : []
     });
     if (index === 0) {
       configurator(modelElementsHash['selected-step-' + (index + 1) + '-navigation-flow'], template, {
           name: 'Selected ' + step.name,
           filters: step.filters
        });
     } else {
       configurator(modelElementsHash['selected-step-' + (index + 1) + '-navigation-flow'], template, {
           name: 'Selected ' + step.name,
           filters: (multilevelMasterDetail.steps.length > 2) ? step.filters : [{ label:'id' }]
        });
     }
  });

  if (multilevelMasterDetail.steps.length > 2){
    var reference = [];
    _.slice(multilevelMasterDetail.steps, 2, multilevelMasterDetail.steps.length)
     .forEach(function (step, index, collection) {
        reference['viewContainer'] = generator(template, {
          type: 'ifml.ViewContainer',
          name: step.name,
          position: {
            x: modelElementsHash['final-view-container'].metadata.graphics.position.x,
            y: modelElementsHash['final-view-container'].metadata.graphics.position.y
          },
          size: {
            height: modelElementsHash['final-view-container'].metadata.graphics.size.height,
            width: modelElementsHash['final-view-container'].metadata.graphics.size.width
          },
          parent: modelElementsHash['xor-view-container'].id
        });

        modelElementsHash['final-view-container'].metadata.graphics.position.x += 250;
        modelElementsHash['final-details'].metadata.graphics.position.x += 250;

        reference['list'] = generator(template, {
          type: 'ifml.ViewComponent',
          stereotype: 'list',
          name: step.collection.charAt(0).toUpperCase() + step.collection.slice(1),
          fields: step.fields,
          filters: index === 0 ? multilevelMasterDetail.steps[1].filters : collection[index - 1].filters,
          position: {
            x: reference['viewContainer'].metadata.graphics.position.x + 20,
            y: reference['viewContainer'].metadata.graphics.position.y + 40
          },
          size: {
            height: modelElementsHash['final-details'].metadata.graphics.size.height,
            width: modelElementsHash['final-details'].metadata.graphics.size.width
          },
          parent: reference['viewContainer'].id
        });
        reference['selected-event'] = generator(template, {
          type: 'ifml.Event',
          name: 'Selected ' + step.name,
          text: 'Selected',
          stereotype: 'selection',
          position: {
           x: modelElementsHash['selected-step-2-event'].metadata.graphics.position.x + 250 * (index + 1),
           y: modelElementsHash['selected-step-2-event'].metadata.graphics.position.y
         },
         vertical: 'bottom',
         parent: reference['list'].id
        });
        reference['navigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'Selected ' + step.name,
          filters: index !== (collection.length - 1) ? reference['list'] : [{ label: 'id' }],
          source: reference['selected-event'].id,
          target: index !== (collection.length - 1) ? idValidator(template.elements, collection[index + 1].collection, '-list') : modelElementsHash['final-details'].id
        });

        if (index === 0) {
          _.filter(template.relations, function (relation) { return (relation.type === 'target' && relation.flow === modelElementsHash['selected-step-2-navigation-flow'].id); })
           .map(function(relation) {
             relation.target = reference['list'].id
           });
        }

        for (var key in reference) {
          template.elements.push(reference[key]);
        };
    });
  }
  return template;
}

exports.create = create;
