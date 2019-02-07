// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var templates = require('../../patterns/collection/index.js').templates;

function addPattern(options) {
    var ifmlModel = options.ifmlModel,
        patternType = options.patternType,
        steps = options.steps,
        template;

    switch (patternType) {
      case 'multilevel master detail':
          steps = steps > 8 ? 8 : steps;

          var stepsArray = [];

          for (var i = 0; i < steps; i++) {
              stepsArray.push({
                  name: "Step " + (i + 1),
                  collection: "collection-" + (i + 1),
                  fields: []
              })
          }

          options = {
              name: 'Multilevel Master Detail Pattern',
              steps: stepsArray,
              details: {
                name: 'Result',
                collection: stepsArray[stepsArray.length - 1].collection,
                fields: []
              }
          }
          template = templates[patternType].create(options);
          break;
      case 'wizard':
          steps = steps > 8 ? 8 : steps;

          var stepsArray = [];

          for (var i = 0; i < steps; i++) {
              stepsArray.push({
                  name: "Step " + (i + 1),
                  formName: "Step " + (i + 1) + " Form",
                  fields: []
              })
          }

          options = {
              name: 'Wizard Pattern',
              steps: stepsArray
          }
          template = templates[patternType].create(options);
          break;
      default:
          template = templates[patternType].create({ voiceCommand: true });
    }

    console.log(template);
    return template;
}

exports.addPattern = addPattern;
