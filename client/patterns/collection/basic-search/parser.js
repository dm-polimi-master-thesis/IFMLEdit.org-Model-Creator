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

function parser(wizard){
  var template = _.cloneDeep(format);
  var modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['wizard-pattern-view-container'], template, {
      size: {
        height: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.size.height,
        width: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.size.width + 400 * (wizard.steps.length - 2)
      }
  });
  configurator(modelElementsHash['xor-view-container'], template, {
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

     configurator(modelElementsHash['step-' + (index + 1) + '-view-container'], template, {
         name: step.name
     });
     configurator(modelElementsHash['step-' + (index + 1) + '-form'], template, {
         name: step.formName,
         fields: step.fields
     });
     configurator(modelElementsHash['validate-step-' + (index + 1) + '-action'], template, {
         name: 'Validate ' + step.name,
         parameters: step.fields,
         results: _.flattenDeep(errorFields),
         parent: modelElementsHash['xor-view-container'].id
     });
     configurator(modelElementsHash['previous-step-' + (index + 1) + '-action'], template, {
         name: 'Previous ' + step.name,
         parameters: index === 0 ? collection[index + 1].fields : [],
         results: step.fields,
         parent: modelElementsHash['xor-view-container'].id
     });
     configurator(modelElementsHash['next-step-' + (index + 1) + '-navigation-flow'], template, {
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

  if (wizard.steps.length > 2){
    var reference = [];
    var previous = [];
    _.slice(wizard.steps, 2, wizard.steps.length)
     .forEach(function (step, index, collection) {
        var errorFields = _.map(step.fields, function (field) {
            return [field,'error-' + field];
        });

        reference['viewContainer'] = generator(template, {
          type: 'ifml.ViewContainer',
          name: step.name,
          position: {
            x: modelElementsHash['review-view-container'].metadata.graphics.position.x,
            y: modelElementsHash['review-view-container'].metadata.graphics.position.y
          },
          parent: modelElementsHash['xor-view-container'].id
        });
        reference['form'] = generator(template, {
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
        reference['validateAction'] = generator(template, {
          type: 'ifml.Action',
          name: 'Validate ' + step.name,
          parameters: step.fields,
          results: _.flattenDeep(errorFields),
          parent: modelElementsHash['xor-view-container'].id,
          position: {
           x: modelElementsHash['validate-step-2-action'].metadata.graphics.position.x + 400 * (1 + index),
           y: modelElementsHash['validate-step-2-action'].metadata.graphics.position.y
          },
          parent: modelElementsHash['xor-view-container'].id
        });
        reference['previousAction'] = generator(template, {
          type: 'ifml.Action',
          name: 'Previous ' + step.name,
          parameters: (index + 1) < collection.length ? collection[index + 1].fields : [],
          results: index === 0 ? modelElementsHash['step-2-form'].fields : previous['form'].fields,
          parent: modelElementsHash['xor-view-container'].id,
          position: {
           x: modelElementsHash['previous-step-2-action'].metadata.graphics.position.x + 400 * (1 + index),
           y: modelElementsHash['previous-step-2-action'].metadata.graphics.position.y
         },
         parent: modelElementsHash['xor-view-container'].id
        });
        reference['cancelEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'Cancel ' + step.name,
          text: 'Cancel',
          position: {
            x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x,
            y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y
          },
          parent: reference['viewContainer'].id
        });
        reference['nextEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'Next ' + step.name,
          text: 'Next',
          position: {
           x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x - 20,
           y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y + 40
         },
         parent: reference['form'].id
        });
        reference['previousEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'Previous ' + step.name,
          text: 'Previous',
          position: {
           x: modelElementsHash['previous-review-event'].metadata.graphics.position.x,
           y: modelElementsHash['previous-review-event'].metadata.graphics.position.y
         },
         parent: reference['form'].id
        });
        reference['koValidateEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'Ko Validate ' + step.name,
          text: 'Ko',
          position: {
            x: reference['validateAction'].metadata.graphics.position.x - 10,
            y: reference['validateAction'].metadata.graphics.position.y + (reference['validateAction'].metadata.graphics.size.height - 20)
          },
          parent: reference['validateAction'].id
        });
        reference['oKValidateEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'Ok Validate ' + step.name,
          text: 'Ok',
          position: {
            x: reference['validateAction'].metadata.graphics.position.x + reference['validateAction'].metadata.graphics.size.width - 10,
            y: reference['validateAction'].metadata.graphics.position.y
          },
          parent: reference['validateAction'].id
        });
        reference['toEvent'] = generator(template, {
          type: 'ifml.Event',
          name: 'To ' + step.name,
          text: 'To',
          position: {
            x: reference['previousAction'].metadata.graphics.position.x - 10,
            y: reference['previousAction'].metadata.graphics.position.y + reference['previousAction'].metadata.graphics.size.height - 20
          },
          parent: reference['previousAction'].id
        });
        reference['toNavigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'To ' + step.name,
          fields: step.fields,
          vertices: [{
            x: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].x + 400 * (index + 1),
            y: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].y
          }],
          source: reference['toEvent'].id,
          target: reference['form'].id
        });
        reference['previousNavigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'Previous ' + step.name,
          fields: step.fields,
          vertices: [{
            x: modelElementsHash['previous-step-2-navigation-flow'].metadata.graphics.vertices[0].x + 400 * (index + 1),
            y: modelElementsHash['previous-review-navigation-flow'].metadata.graphics.vertices[0].y
          }],
          source: reference['previousEvent'].id,
          target: index === 0 ? modelElementsHash['previous-step-2-action'].id : previous['previousAction'].id
        });
        reference['okNavigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'Ok Validate ' + step.name,
          source: reference['oKValidateEvent'].id,
          target: (index + 1) < collection.length ? idValidator(elements, collection[index + 1].formName, '-form') : modelElementsHash['review-details'].id
        });
        reference['koNavigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'Ko Validate ' + step.name,
          fields: _.flattenDeep(errorFields),
          source: reference['koValidateEvent'].id,
          target: reference['form'].id
        });
        reference['nextNavigationFlow'] = generator(template, {
          type: 'ifml.NavigationFlow',
          name: 'Next ' + step.name,
          fields: step.fields,
          source: reference['nextEvent'].id,
          target: reference['validateAction'].id
        });

        for (var key in reference) {
          template.elements.push(reference[key]);
        };

        if (index === 0) {
          _.filter(template.relations, function (relation) { return (relation.type === 'target' && relation.flow === modelElementsHash['ok-validate-step-2-navigation-flow'].id); })
           .map(function(relation) {
             relation.target = reference['form'].id
           });
        }

        if ((index + 1) === collection.length) {
          _.filter(template.relations, function (relation) { return (relation.type === 'target' && relation.flow === modelElementsHash['previous-review-navigation-flow'].id); })
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

        previous = _.cloneDeep(reference);
    });
  }

  return template;
}

exports.parser = parser;
