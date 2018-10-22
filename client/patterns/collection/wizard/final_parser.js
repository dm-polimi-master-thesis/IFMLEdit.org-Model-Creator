// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toId = require('../../utilities.js').toId,
    toHash = require('../../utilities.js').toHash,
    template = require('./default.json'),
    configurator = require('../../configurator/elementConfigurator.js').configurator;
    generator = require('../../generator/relationGenerator.js').generator;

function parser(wizard){
  var modelElementsHash = toHash(template.elements);

  configurator(modelElementsHash['wizard-pattern-view-container'], template.relations, {
      position: {
        x: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.position.x + 400 * (wizard.steps.length - 2),
        y: modelElementsHash['wizard-pattern-view-container'].metadata.graphics.position.y
      }
  });
  configurator(modelElementsHash['xor-view-container'], template.relations, {
      name: wizard.name,
      position: {
        x: modelElementsHash['xor-view-container'].metadata.graphics.position.x + 400 * (wizard.steps.length - 2),
        y: modelElementsHash['xor-view-container'].metadata.graphics.position.y
      }
  });

  _.slice(wizard.steps, 0, 2)
   .forEach(function(step, index)){
     var errorFields = _.forEach(step.fields, function (field) {
       return 'error-' + field
     }});

     configurator(modelElementsHash['step-' + index + 1 + '-view-container'], template.relations, {
         name: step.name
     });
     configurator(modelElementsHash['step-' + index + 1 + '-form']), template.relations, {
         name: step.formName,
         fields: step.fields
     });
     configurator(modelElementsHash['next-step-' + index + 1 + '-navigation-flow']), template.relations, {
         name: 'Next ' + step.formName,
         fields: step.fields
     });
     configurator(modelElementsHash['ko-validate-step-' + index + 1 + '-navigation-flow']), template.relations, {
         name: 'Ko Validate ' + step.formName,
         fields: _.cloneDeep(step.fields).push(errorFields)
     });
     configurator(modelElementsHash['to-step-' + index + 1 + '-navigation-flow']), template.relations, {
         name: 'To ' + step.formName,
         fields: step.fields
     });
     configurator(modelElementsHash['validate-step-' + index + 1 + '-action']), template.relations, {
         name: 'Validate ' + step.formName,
         parameters: step.fields,
         results: _.cloneDeep(step.fields).push(errorFields),
         parent: toId(wizard.name, '-view-container')
     });
   }

  if (wizard.steps.length > 2){
    _.slice(wizard.steps, 2, wizard.steps.length)
     .forEach(function (step) {
        _.forEach(function(step, index)){
          var errorFields = _.forEach(step.fields, function (field) {
            return 'error-' + field
        }});
        var viewContainer = generator(relations, {
          type: 'ifml.viewContainer',
          name: step.name,
          position: {
            x: modelElementsHash['review-view-container'].metadata.graphics.position.x,
            y: modelElementsHash['review-view-container'].metadata.graphics.position.y
          }
        });
        var form = generator(relations, {
          type: 'ifml.ViewComponent',
          stereotype: 'form',
          name: step.formName,
          fields: step.fields,
          position: {
            x: viewContainer.metadata.graphics.position.x + 20,
            y: viewContainer.metadata.graphics.position.x + 40
          }
        });
        var cancelEvent = generator(relations, {
          type: 'ifml.Event'
          name: 'Cancel ' + step.formName,
          position: {
            x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x,
            y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y
          }
        });
        var nextEvent = generator(relations, {
          type: 'ifml.Event'
          name: 'Next ' + step.formName,
          position: {
           x: modelElementsHash['cancel-review-event'].metadata.graphics.position.x - 20,
           y: modelElementsHash['cancel-review-event'].metadata.graphics.position.y - 40
          }
        });
        var previousEvent = generator(relations, {
          type: 'ifml.Event'
          name: 'Previous ' + step.formName,
          position: {
           x: modelElementsHash['previous-review-event'].metadata.graphics.position.x,
           y: modelElementsHash['previous-review-event'].metadata.graphics.position.y
          }
        });
        var validateAction = generator(relations, {
          type: 'ifml.Action'
          name: 'Validate ' + step.formName,
          parameters: step.fields,
          results: _.cloneDeep(step.fields).push(errorFields),
          parent: toId(wizard.name, '-view-container'),
          position: {
           x: modelElementsHash[toId(wizard.name, '-view-container')].metadata.graphics.position.x + 260 + 400 * (2 + index),
           y: modelElementsHash[toId(wizard.name, '-view-container')].metadata.graphics.position.y - 20;
          }
        });
        var koValidateEvent = generator(relations, {
          type: 'ifml.Event'
          name: 'Ko Validate ' + step.formName,
          position: {
            x: validateAction.metadata.graphics.position.x,
            y: validateAction.metadata.graphics.position.y + (validateAction.metadata.graphics.size.height - 10);
          }
        });
        var oKValidateEvent = generator(relations, {
          name: 'Ko Validate ' + step.formName,
          position: {
            x: validateAction.metadata.graphics.position.x + validateAction.metadata.graphics.size.width,
            y: validateAction.metadata.graphics.position.y + 10;
          }
        });
        var previousAction = generator(relations, {
          name: 'Previous ' + step.formName,
          parameters: step.fields,
          results: _.cloneDeep(step.fields).push(errorFields),
          parent: toId(wizard.name, '-view-container'),
          position: {
           x: modelElementsHash[toId(wizard.name, '-view-container')].metadata.graphics.position.x + 260 + 400 * (2 + index),
           y: modelElementsHash[toId(wizard.name, '-view-container')].metadata.graphics.position.y - 20;
          }
        });
        var toEvent = generator(relations, {
          name: 'To ' + step.formName,
          position: {
            x: previousAction.metadata.graphics.position.x,
            y: previousAction.metadata.graphics.position.y - 10;
          }
        });
        var toNavigationFlow = generator(relations, template.relations, {
            name: 'To ' + step.formName,
            fields: step.fields,
            vertices: [{
              x: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].x + 400 * index,
              y: modelElementsHash['to-step-2-navigation-flow'].metadata.graphics.vertices[0].y
            }]
        });
        var previousNavigationFlow = generator(relations, template.relations, {
            name: 'Previous ' + step.formName,
            fields: step.fields,
            parent: previousEvent.id,
            child:
            vertices: [{
              x: modelElementsHash['previous-step-2-navigation-flow'].metadata.graphics.vertices[0].x,
              y: modelElementsHash['previous-step-2-navigation-flow'].metadata.graphics.vertices[0].y
            }]
        });
        var okNavigationFlow = generator(relations, template.relations, {
            name: 'Ok ' + step.formName
        });
        var koNavigationFlow = generator(relations, template.relations, {
            name: 'Ko ' + step.formName,
            fields: _.cloneDeep(step.fields).push(errorFields)
        });
        var nextNavigationFlow = generator(relations, template.relations, {
            name: 'Next ' + step.formName,
            fields: step.fields
        });


        modelElementsHash['review-view-container'].metadata.graphics.position.x += 400;
        modelElementsHash['cancel-review-event'].metadata.graphics.position.x += 400;
        modelElementsHash['review-details'].metadata.graphics.position.x += 400;
        modelElementsHash['previous-review-event'].metadata.graphics.position.x += 400;
        modelElementsHash['end-wizard-event'].metadata.graphics.position.x += 400;
        modelElementsHash['end-navigation-flow'].metadata.graphics.position.x += 400;
        modelElementsHash['save-action'].metadata.graphics.position.x += 400;
       });
     });
  }
}
