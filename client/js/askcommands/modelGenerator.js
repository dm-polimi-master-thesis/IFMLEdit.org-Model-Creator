// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var partialModelValidator = require('../ifml/utilities/validator/partialModelValidator.js').partialModelValidator;

function modelGenerator (options) {
  var template = options.template,
      ifml = options.ifml,
      ifmlBoard = options.ifmlBoard,
      ifmlModel = options.ifmlModel;

  try {
      ifmlBoard.clearHistory();

      function boundingBox(cells) {
          var box = {
              x: {
                  min: Number.MAX_SAFE_INTEGER,
                  max: Number.MIN_SAFE_INTEGER
              },
              y: {
                  min: Number.MAX_SAFE_INTEGER,
                  max: Number.MIN_SAFE_INTEGER
              }
          };
          cells.map(function(element) {
              if(element.attributes.type == 'ifml.ViewContainer' ||
                  element.attributes.type == 'ifml.Action'){
                  if (element.attributes.position.x < box.x.min) {
                      box.x.min = element.attributes.position.x;
                  }
                  if (element.attributes.position.y < box.y.min) {
                      box.y.min = element.attributes.position.y;
                  }
                  if (element.attributes.position.x + element.attributes.size.width > box.x.max) {
                      box.x.max = element.attributes.position.x + element.attributes.size.width;
                  }
                  if (element.attributes.position.y + element.attributes.size.height > box.y.max) {
                      box.y.max = element.attributes.position.y + element.attributes.size.height;
                  }
              }
          });
          return box;
      }
      var start = new Date(),
          loaded_at = new Date();

      var boardBB = {
          x: {
              min: 0,
              max: 0
          },
          y: {
              min: 0,
              max: 0
          }
      };

      var toBeAdded = ifml.fromJSON(template),
          toBeAddedBB = boundingBox(toBeAdded);

      if (ifmlModel.attributes.cells.models.length > 0) {
          boardBB = boundingBox(ifmlModel.attributes.cells.models);
          toBeAdded = ifml.fromJSON(partialModelValidator(ifml.toJSON(ifmlModel), template));
      }

      toBeAdded = _(toBeAdded).map(function(model) {
          if (model.attributes.position) {
              model.attributes.position.x += boardBB.x.max - toBeAddedBB.x.min + 20;
              model.attributes.position.y += boardBB.y.min - toBeAddedBB.y.min;
          }
          if (model.attributes.vertices) {
              for (var i = 0; i<model.attributes.vertices.length; i++){
                  model.attributes.vertices[i].x += boardBB.x.max - toBeAddedBB.x.min + 20;
                  model.attributes.vertices[i].y += boardBB.y.min - toBeAddedBB.y.min;
              }
          }
          return model;
      }).value();

      var beforeAdd = ifmlModel.getCells();

      ifmlModel.addCells(toBeAdded);
      ifmlBoard.clearHistory();

  } catch (exception) {
      console.log(exception);
      ifmlBoard.clearHistory();
      $.notify({message: 'Invalid input file!'}, {allow_dismiss: true, type: 'danger'});
      return;
  }

  if (beforeAdd.length === 0) {
      ifmlBoard.zoomE();
  }

  return false;
}

exports.modelGenerator = modelGenerator;
