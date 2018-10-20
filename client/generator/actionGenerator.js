// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('./toId.js');

function actionGenerator(options) {
  return {
      attributes: {
          type: 'ifml.Action',
          id: toId(options.name,'-action'),
          name: options.name,
          events: [],
          parameters: options.parameters || [],
          results: options.results || [],
          parent: options.parent,
          matrixPos: options.matrixPos || {x: 1, y: 1},
          size: {
              width: 110,
              height: 70
          }
      }
  }
}

function actionValidator(options) {
  var results = [];
  if(options.parameters !== undefined && Array.isArray(options.parameters)){
    var errorParams = _.map(options.parameters, function (param) {
      return 'error-' + param;
    });
    results = _.cloneDeep(options.parameters).push(errorParams);
  }

  return {
      attributes: {
          type: 'ifml.Action',
          id: toId(options.name,'-action'),
          name: options.name,
          events: [],
          parameters: options.parameters || [],
          results: results,
          parent: options.parent,
          matrixPos: options.matrixPos || {x: 1, y: 1},
          size: {
              width: 110,
              height: 70
          }
      }
  }
}

exports.actionGenerator = actionGenerator;
exports.actionValidator = actionValidator;
