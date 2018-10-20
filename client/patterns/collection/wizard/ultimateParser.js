// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toId = require('../../utilities.js').toId,
    viewContainerGenerator = require('../../../generator/viewContainerGenerator.js').viewContainerGenerator,
    actionGenerator = require('../../../generator/actionGenerator.js').actionGenerator,
    actionValidator = require('../../../generator/actionValidator.js').actionGenerator,
    formGenerator = require('../../../generator/viewContainerGenerator.js').formGenerator,
    eventGenerator = require('../../../generator/viewContainerGenerator.js').eventGenerator,
    navigationFlowGenerator = require('../../../generator/navigationFlowGenerator.js').navigationFlowGenerator,
    detailsGenerator = require('../../../generator/detailsGenerator').detailsGenerator;

function parser(wizard) {
  var model = viewContainerGenerator({
    name: 'Wizard',
  });

  model.viewContainers.push(viewContainerGenerator({
    name: wizard.name,
    xor: true,
    parent: model.id,
    level: 1
  }));

  var reference = model.viewContainers[0],
      matrixPosX = 1;

  _.map(wizard.steps, function (step,index,collection) {
    var options = {
      name: step.name,
      parent: reference.id,
      level: 2,
      matrixPos: {
        x: 1 + index * 2,
        y: 1
      }
    }
    if(index === 0){
      options.default = true;
    }

    var viewContainer = viewContainerGenerator(options);

    viewContainer.events = eventGenerator({
      name: 'Cancel',
      parent: viewContainer.id,
      matrixPos: {
        x: 3,
        y: 1
      }
    });

    var form = formGenerator({
      name: step.formName,
      fields: step.fields,
      parent: viewContainer.id
    });

    var nextEvent = eventGenerator({
      name: 'Next',
      parent: form.id,
      matrixPos: {
        x: 3,
        y: 1
      }
    };

    var validateAction = actionValidator({
      name: "Validate " + step.name,
      parameters: step.fields,
      parent: reference.id,
      matrixPos: {
        x: index * 2,
        y: 1
      }
    });

    var okValidateEvent = eventGenerator({
      name: 'Ok',
      parent: validateAction.id,
      matrixPos: {
        x: 3,
        y: 1
      }
    });

    var koValidateEvent = eventGenerator({
      name: 'Ko',
      parent: validateAction.id,
      matrixPos: {
        x: 1,
        y: 3
      }
    };

    var nextNavigationFlow = navigationFlowGenerator({
      fields: step.fields,
      source: nextEvent.id,
      target: validateAction.id
    });

    var okNavigationFlow = navigationFlowGenerator({
      fields: [],
      source: validateAction.id,
      target: toId(collection[index + 1].formName,'-form-view-component')
    });

    var koNavigationFlow = navigationFlowGenerator({
      fields: action.results,
      source: validateAction.id,
      target: form.id
    });

    okValidateEvent.navigationFlow.push(okNavigationFlow);
    koValidateEvent.navigationFlow.push(koNavigationFlow);
    validateAction.events.push(okValidateEvent,koValidateEvent);
    nextEvent.navigationFlow.push(nextNavigationFlow);
    form.events.push(nextEvent);
    viewContainer.actions.push(validateAction);

    if(!(index === 0)){
      var previousEvent = eventGenerator({
        name: 'previous',
        parent: form.id,
        matrixPos: {
          x: 1,
          y: 3
        }
      };

      var previousAction = actionGenerator({
        name: "Previous " + step.name,
        parameters: step.fields,
        results: collection[index - 1].fields,
        parent: reference.id,
        matrixPos: {
          x: index * 2,
          y: 2
        }
      });

      var toEvent = eventGenerator({
        name: 'to',
        parent: previousAction.id,
        matrixPos: {
          x: 1,
          y: 3
        }
      });

      var previousNavigationFlow = navigationFlowGenerator({
        fields: step.fields,
        source: nextEvent.id,
        target: previousAction.id
      });

      var toNavigationFlow = navigationFlowGenerator({
        fields: previousAction.results,
        source: previousAction.id,
        target: toId(collection[index - 1].formName,'-form-view-component')
      });

      previousEvent.navigationFlow.push(previousNavigationFlow);
      toEvent.navigationFlow.push(toNavigationFlow);
      previousAction.events.push(toEvent);
      form.events.push(previousEvent);
      viewContainer.actions.push(validateAction);
    }

    viewContainer.form = form;
  });

  var reviewViewContainer = viewContainerGenerator({
    name: 'Review',
    parent: reference.id,
    level: 2,
    matrixPos: {
      x: 1 + wizard.steps.length * 2,
      y: 1
    }
  });

  var details = detailsGenerator({
    name: step.formName,
    fields: step.fields,
    collection: "wizard-collection",
    parent: viewContainer.id
  });

  var endEvent = eventGenerator({
    name: 'end',
    parent: details.id,
    matrixPos: {
      x: 3,
      y: 3
    }
  });

  var previousEvent = eventGenerator({
    name: 'Previous',
    parent: details.id,
    matrixPos: {
      x: 1,
      y: 3
    }
  };
}

exports.parser = parser;


/*
form.events.push(eventGenerator({
  name: 'End',
  parent: form.id,
  matrixPos: {
    x: 3,
    y: 3
  }
}));*/
