// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toHash = require('./toHash.js').toHash,
    configurator = require('../configurator/elementConfigurator').configurator;

function partialModelValidator(model1, model2) {
  var hashModel1 = toHash(model1.elements);
  console.log(hashModel1);
  _.forEach(model2.elements, function(element){
    var id = element.id;
    if(hashModel1[id] !== undefined){
      var index = 1,
          newId = id + '-' + index;
      while(hashModel1[newId] !== undefined){
        index++;
        newId = id + "-" + index;
      }
      configurator(element, model2, {
        type: element.type,
        id: newId
      });
    }
  });
  return model2;
}

exports.partialModelValidator = partialModelValidator;
