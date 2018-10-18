// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toViewContainer = require('../../utilities.js').toViewContainer,
    toId = require('../../utilities.js').toId,
    template = require('./template.json');

function parser(pattern) {
  var pseudoModel = _.cloneDeep(template);
  var patternContainer = {
    id : 'wizard-pattern-view-container',
    name : 'Wizard Pattern',
    role : 'pattern-container'
  };
  var xorContainer = {
    id : toId(pattern.name, '-view-container'),
    name : pattern.name,
    parent : patternContainer.id,
    role : 'xor-container'
  };

  patternContainer = pseudoModel.elements[0];
  xorContainer = pseudoModel.elements[1];

  xorContainer.id = toId(pattern.name, '-view-container');
  xorContainer.attributes.name = pattern.name;
  xorContainer.metadata.graphics.size.width = pattern.steps.length * (20 + 190 + 20);
  xorContainer.metadata.graphics.size.height = 40 + 150 + 20;
  patternContainer.metadata.graphics.size.width = 20 + xorContainer.metadata.graphics.size.width + 20;
  patternContainer.metadata.graphics.size.height = 40 + xorContainer.metadata.graphics.size.height + 20;

  _.map(pattern.steps, function (step,index,collection) {
    var viewContainer = {
      attributes:{
        name: step.name,
        landmark: false,
        xor: false
      },
      metadata:{
        graphics:{
          position:{
            x: pseudoModel.elements[1].metadata.graphics.position.x + 20 + index * 230,
            y: 40 + pseudoModel.elements[1].metadata.graphics.position.y
          },
          size:{
            height: 150,
            width: 190
          }
        }
      },
      id: toId(step.name,'-view-container'),
      type: "ifml.ViewContainer"
    };

    if(index === 0){
      viewContainer2.attributes.default = true;
    }

    pseudoModel.elements.push(viewContainer2);
    pseudoModel.relations.push({
      type: "hierarchy",
      parent: pseudoModel.elements[1].id,
      child: toId(step.name,'-view-container')
    });
  });

  console.log(JSON.stringify(pseudoModel));
}

exports.parser = parser;
