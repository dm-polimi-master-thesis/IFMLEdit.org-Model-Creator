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
          attributes: {
              type : 'ifml.ViewContainer',
              id: 'wizard-pattern-view-container',
              name: 'Wizard Pattern',
              default: false,
              landmark: false,
              xor: false,
              parent: undefined,
              children: [{
                  attributes: {
                      type : 'ifml.ViewContainer',
                      id: toId(wizard.name, '-view-container'),
                      name: wizard.name,
                      default: false,
                      landmark: false,
                      xor: true,
                      parent: 'wizard-pattern-view-container',
                      children: [],
                      level: 1,
                      matrixPos: {
                        x: 1,
                        y: 1,
                      }
                  }
              }],
              level: 0,
              matrixPos: undefined
          }
  };

  var reference = pattern.children[0];
  var matrixPosX = 1;

  _.map(wizard.steps, function (step,index,collection) {
    var viewContainer = {
            attributes: {
                type : 'ifml.ViewContainer',
                id: toId(step.name,'-view-container'),
                name: step.name,
                default: false,
                landmark: false,
                xor: false,
                viewComponents: [
                  {
                    attributes: {
                        type: 'ifml.ViewComponent',
                        stereotype: 'form',
                        id: toId(step.formName,'-form-view-component'),
                        name: step.formName,
                        fields: fields,
                        events: [],
                        parent: toId(step.name,'-view-container'),
                        level: 3,
                        matrixPos: {
                          x: 1,
                          y: 1,
                        }
                    }
                  }
                ],
                events: [{
                  attributes:
                      type: 'ifml.Event',
                      id: 'cancel-' + toId(step.name,'-event'),
                      name: {text: "Cancel", vertical: "top", horizontal: "middle"},
                      parent: toId(step.name,'-view-container')
                }],
                actions: [],
                parent: reference.id,
                children: undefined,
                level: 2,
                matrixPos: {
                  x: matrixPosX++,
                  y: 1,
                }
            }
    }

    if(index === 0){
      viewContainer.default = true;
    }
    if(index === (collection.length -1)){
      viewContainer.viewComponents[0].events.push({
        attributes: {
            type: 'ifml.Event',
            id: 'end-' + toId(step.name,'-event'),
            name: {text: "End", vertical: "top", horizontal: "middle"},
            parent: viewContainer.viewComponents[0].id
        }
      });
    }
    if (!(index === (collection.length - 1))) {
      var bindings = _.map(fields, function(field){
        return {
          input: field,
          output: field
        }
      });
      var navigationFlow = {
        attributes: {
            type: 'ifml.NavigationFlow',
            id: 'from-next-' + toId(step.name,'-event') + '-to-validate-' + toId(step.name,''),'-action') + "-navigation-flow",
            bindings: bindings,
            source: 'next-' + toId(step.name,'-event'),
            target: 'validate-' + toId(step.name,'-action')
        }
      }
      viewContainer.viewComponents[0].events.push({
        attributes: {
            type: 'ifml.Event',
            id: 'next-' + toId(step.name,'-event'),
            name: {text: "Next", vertical: "top", horizontal: "middle"},
            navigationFlow: navigationFlow,
            parent: viewContainer.viewComponents[0].id,
            matrixPos: {
              x: 3,
              y: 2
            }
        }
      });
      viewContainer.actions.push(
        attributes: {
            type: 'ifml.Action',
            id: 'validate-' + toId(step.name,'-action'),
            name: "Validate " + step.name,
            events: {}
            parent: reference.id,
            matrixPos: {
              x: 3,
              y: 2
            }
        }
      );
    }
    if (!(index === 0)) {
      var navigationFlow = {
        attributes: {
            type: 'ifml.NavigationFlow',
            id: 'from-previous-' + toId(step.name,'-event') + '-to-previous-' + toId(step.name,''),'-action') + "-navigation-flow",
            bindings: [],
            source: 'previous-' + toId(step.name,'-event'),
            target: 'previous-' + toId(step.name,'-action')
        }
      }
      viewContainer.viewComponents[0].events.push({
        attributes: {
            type: 'ifml.Event',
            id: 'back-' + toId(step.name,'-event'),
            name: {text: "Back", vertical: "top", horizontal: "middle"},
            navigationFlow: navigationFlow,
            parent: viewContainer.viewComponents[0].id,
            matrixPos: {
              x: 1,
              y: 3
            }
        }
      });
    }

    reference.children.push(viewContainer);
  });

  console.log("pattern",pattern);
  return pattern;
}

exports.parser = parser;
