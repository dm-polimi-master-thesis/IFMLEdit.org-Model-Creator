// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toId = require('../../utilities.js').toId,
    toHash = require('../../utilities.js').toHash,
    template = require('./default.json'),
    configurator = require('../../configurator/elementConfigurator.js').configurator,
    generator = require('../../generator/elementGenerator.js').generator;

function parser(wizard){
  var format = _.cloneDeep(template);
  var modelElementsHash = toHash(format.elements),
      elements = format.elements,
      relations = format.relations;

  configurator(modelElementsHash['wizard-pattern-view-container'], relations, {
      size: {
        height: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.size.height,
        width: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.size.width + 400 * (wizard.steps.length - 2)
      }
  });
  configurator(modelElementsHash['xor-view-container'], relations, {
      name: wizard.name,
      size: {
        height: modelElementsHash['xor-view-container'].metadata.graphics.size.height,
        width: modelElementsHash['xor-view-container'].metadata.graphics.size.width + 400 * (wizard.steps.length - 2)
      }
  });

  _.slice(wizard.steps, 0, 2)
   .forEach(function(step, index, collection){
     var errorFields = _.map(step.fields, function (field) {
       return [field,'error-' + field];
     });

     configurator(modelElementsHash['step-' + (index + 1) + '-view-container'], relations, {
         name: step.name
     });
     configurator(modelElementsHash['step-' + (index + 1) + '-form'], relations, {
         name: step.formName,
         fields: step.fields
     });
     configurator(modelElementsHash['validate-step-' + (index + 1) + '-action'], relations, {
         name: 'Validate ' + step.name,
         parameters: step.fields,
         results: _.flattenDeep(errorFields),
         parent: modelElementsHash['xor-view-container'].id
     });
     configurator(modelElementsHash['previous-step-' + (index + 1) + '-action'], relations, {
         name: 'Previous ' + step.name,
         parameters: index === 0 ? collection[index + 1].fields : [],
         results: step.fields,
         parent: modelElementsHash['xor-view-container'].id
     });
     configurator(modelElementsHash['next-step-' + (index + 1) + '-navigation-flow'], relations, {
         name: 'Next ' + step.name,
         fields: step.fields
     });
     configurator(modelElementsHash['ok-validate-step-' + (index + 1) + '-navigation-flow'], relations, {
         name: 'Ok Validate ' + step.name
     });
     configurator(modelElementsHash['ko-validate-step-' + (index + 1) + '-navigation-flow'], relations, {
         name: 'Ko Validate ' + step.name,
         fields: _.flattenDeep(errorFields)
     });
     configurator(modelElementsHash['to-step-' + (index + 1) + '-navigation-flow'], relations, {
         name: 'To ' + step.name,
         fields: step.fields
     });
     if(index === 1){
       configurator(modelElementsHash['previous-step-' + (index + 1) + '-navigation-flow'], relations, {
           name: 'Previous ' + step.name,
           fields: step.fields
       });
     }
  });

  if (wizard.steps.length > 2){
    var reference = [];
    _.slice(wizard.steps, 2, wizard.steps.length)
     .forEach(function (step, index, collection) {
        var errorFields = _.map(step.fields, function (field) {
            return [field,'error-' + field];
        });

        reference['viewContainer'] = generator(relations, {
          type: 'ifml.ViewContainer',
          name: step.name,
          position: {
            x: modelElementsHash['review-view-container'].metadata.graphics.position.x,
            y: modelElementsHash['review-view-container'].metadata.graphics.position.y
          },
          parent: modelElementsHash['xor-view-container'].id
        });
        reference['validateAction'] = generator(relations, {
          type: 'ifml.Action',
          name: 'Validate ' + step.formName,
          parameters: step.fields,
          results: _.flattenDeep(errorFields),
          parent: toId(wizard.name, '-view-container'),
          position: {
           x: modelElementsHash['validate-step-2-action'].metadata.graphics.position.x + 400 * (1 + index),
           y: modelElementsHash['validate-step-2-action'].metadata.graphics.position.y
          },
          parent: modelElementsHash['xor-view-container'].id
        });
        reference['previousAction'] = generator(relations, {
          type: 'ifml.Action',
          name: 'Previous ' + step.formName,
          parameters: (index + 1) < collection.length ? collection[index + 1].fields : [],
          results: index === 0 ? modelElementsHash['step-2-form'].fields : reference['form'].fields,
          parent: modelElementsHash['xor-view-container'].id,
          position: {
           x: modelElementsHash['previous-step-2-action'].metadata.graphics.position.x + 400 * (1 + index),
           y: modelElementsHash['previous-step-2-action'].metadata.graphics.position.y
         },
         parent: modelElementsHash['xor-view-container'].id
        });
        reference['form'] = generator(relations, {
          type: 'ifml.ViewComponent',
          stereotype: 'form',
          name: step.formName,
          fields: step.fields,
          position: {
            x: reference['viewContainer'].metadata.graphics.position.x + 20,
            y: reference['viewContainer'].metadata.graphics.position.y + 40
          },
          parent: reference['viewContainer'].id
        });
        reference['cancelEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'Cancel ' + step.formName,
          text: 'Cancel',
          position: {
            x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x,
            y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y
          },
          parent: reference['viewContainer'].id
        });
        reference['nextEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'Next ' + step.formName,
          text: 'Next',
          position: {
           x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x - 20,
           y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y + 40
         },
         parent: reference['form'].id
        });
        reference['previousEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'Previous ' + step.formName,
          text: 'Previous',
          position: {
           x: modelElementsHash['previous-review-event'].metadata.graphics.position.x,
           y: modelElementsHash['previous-review-event'].metadata.graphics.position.y
         },
         parent: reference['form'].id
        });
        reference['koValidateEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'Ko Validate ' + step.formName,
          text: 'Ko',
          position: {
            x: reference['validateAction'].metadata.graphics.position.x - 10,
            y: reference['validateAction'].metadata.graphics.position.y + (reference['validateAction'].metadata.graphics.size.height - 20)
          },
          parent: reference['validateAction'].id
        });
        reference['oKValidateEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'Ok Validate ' + step.formName,
          text: 'Ok',
          position: {
            x: reference['validateAction'].metadata.graphics.position.x + reference['validateAction'].metadata.graphics.size.width - 10,
            y: reference['validateAction'].metadata.graphics.position.y
          },
          parent: reference['validateAction'].id
        });
        reference['toEvent'] = generator(relations, {
          type: 'ifml.Event',
          name: 'To ' + step.formName,
          text: 'To',
          position: {
            x: reference['previousAction'].metadata.graphics.position.x - 10,
            y: reference['previousAction'].metadata.graphics.position.y + reference['previousAction'].metadata.graphics.size.height - 20
          },
          parent: reference['previousAction'].id
        });
        reference['toNavigationFlow'] = generator(relations, {
          type: 'ifml.NavigationFlow',
          name: 'To ' + step.formName,
          fields: step.fields,
          vertices: [{
            x: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].x + 400 * (index + 1),
            y: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].y
          }],
          source: reference['toEvent'].id,
          target: reference['form'].id
        });
        reference['previousNavigationFlow'] = generator(relations, {
          type: 'ifml.NavigationFlow',
          name: 'Previous ' + step.formName,
          fields: step.fields,
          vertices: [{
            x: modelElementsHash['previous-review-navigation-flow'].metadata.graphics.vertices[0].x + 400 * index,
            y: modelElementsHash['previous-review-navigation-flow'].metadata.graphics.vertices[0].y
          }],
          source: reference['previousEvent'].id,
          target: index === 0 ? modelElementsHash['previous-step-2-action'].id : toId('previous-' + collection[index - 1].name, '-action')
        });
        reference['okNavigationFlow'] = generator(relations, {
          type: 'ifml.NavigationFlow',
          name: 'Ok Validate ' + step.formName,
          source: reference['oKValidateEvent'].id,
          target: (index + 1) < collection.length ? toId(collection[index + 1].formName, '-form') : modelElementsHash['review-details'].id
        });
        reference['koNavigationFlow'] = generator(relations, {
          type: 'ifml.NavigationFlow',
          name: 'Ko Validate ' + step.formName,
          fields: _.flattenDeep(errorFields),
          source: reference['koValidateEvent'].id,
          target: reference['form'].id
        });
        reference['nextNavigationFlow'] = generator(relations, {
          type: 'ifml.NavigationFlow',
          name: 'Next ' + step.formName,
          fields: step.fields,
          source: reference['nextEvent'].id,
          target: reference['validateAction'].id
        });

        for (var key in reference) {
          elements.push(reference[key]);
        };

        if (index === 0) {
          _.filter(relations, function (relation) { return (relation.type === 'target' && relation.flow === 'ok-validate-step-2-navigation-flow'); })
           .map(function(relation) {
             relation.target = reference['form'].id
           });
        }

        if ((index + 1) === collection.length) {
          _.filter(relations, function (relation) { return (relation.type === 'target' && relation.flow === 'previous-review-navigation-flow'); })
           .map(function(relation) {
             relation.target = reference['previousAction'].id
           });
        }

        modelElementsHash['review-view-container'].metadata.graphics.position.x += 400;
        modelElementsHash['cancel-review-event'].metadata.graphics.position.x += 400;
        modelElementsHash['review-details'].metadata.graphics.position.x += 400;
        modelElementsHash['previous-review-event'].metadata.graphics.position.x += 400;
        modelElementsHash['end-wizard-event'].metadata.graphics.position.x += 400;
        modelElementsHash['previous-review-navigation-flow'].metadata.graphics.vertices[0].x += 400;
        modelElementsHash['save-action'].metadata.graphics.position.x += 400;
    });
  }

  return format;
}

exports.parser = parser;
