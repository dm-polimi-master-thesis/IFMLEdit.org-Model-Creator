// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toViewContainer = require('../../utilities.js').toViewContainer,
    toId = require('../../utilities.js').toId,
    template = require('./template.json');

function parser(wizard){
  var pattern = {
    type : 'ifml.ViewContainer',
    id: 'wizard-pattern-view-container',
    name: 'Wizard Pattern',
    default: false,
    landmark: false,
    xor: false,
    children: [{
      type : 'ifml.ViewContainer',
      id: toId(wizard.name, '-view-container'),
      name: wizard.name,
      default: false,
      landmark: false,
      xor: true,
      parent: 'wizard-pattern-view-container',
      children: []
    }],
    parent: undefined
  };

  var reference = pattern.children[0];

  _.map(wizard.steps, function (step,index,collection) {
    var fields = step.fields;

    if(!(index === 0)){
      fields.push(collection[index - 1].fields);
      fields = _.flattenDeep(fields);
    }

    var viewContainer = {
      type : 'ifml.ViewContainer',
      id: toId(step.name,'-view-container'),
      name: step.name,
      default: false,
      landmark: false,
      xor: false,
      viewComponents: [
        {
          type: 'ifml.ViewComponent',
          stereotype: 'form',
          id: toId(step.formName,'-form-view-component'),
          name: step.formName,
          fields: fields,
          events: [],
          parent: toId(step.name,'-view-container')
        }
      ],
      events: [{
        type: 'ifml.Event',
        id: 'cancel-' + toId(step.name,'-event'),
        name: {text: "Cancel", vertical: "top", horizontal: "middle"},
        parent: toId(step.name,'-view-container')
      }],
      parent: reference.id,
      children: undefined
    }

    if(index === 0){
      viewContainer.default = true;
    }
    if(index === (collection.length -1)){
      viewContainer.viewComponents[0].events.push({
        type: 'ifml.Event',
        id: 'end-' + toId(step.name,'-event'),
        name: {text: "End", vertical: "top", horizontal: "middle"},
        parent: viewContainer.viewComponents[0].id
      });
    }
    if (!(index === (collection.length - 1))) {
      var flows = _.map(fields, function(field){
        return {
          input: field,
          output: field,
          source: 'next-' + toId(step.name,'-event'),
          destination: toId(collection[index + 1].formName,'-form-view-component')
        }
      });
      viewContainer.viewComponents[0].events.push({
        type: 'ifml.Event',
        id: 'next-' + toId(step.name,'-event'),
        name: {text: "Next", vertical: "top", horizontal: "middle"},
        flows: flows,
        parent: viewContainer.viewComponents[0].id
      });
    }
    if (!(index === 0)) {
      var flows = _.map(_.flattenDeep(collection[index - 1].fields), function(field){
        return {
          input: field,
          output: field,
          source: 'back-' + toId(step.name,'-event'),
          destination: toId(collection[index - 1].formName,'-form-view-component')
        }
      });
      viewContainer.viewComponents[0].events.push({
        type: 'ifml.Event',
        id: 'back-' + toId(step.name,'-event'),
        name: {text: "Back", vertical: "top", horizontal: "middle"},
        flows: flows,
        parent: viewContainer.viewComponents[0].id
      });
    }

    reference.children.push(viewContainer);
  });

  console.log("pattern",pattern);
}

exports.parser = parser;
