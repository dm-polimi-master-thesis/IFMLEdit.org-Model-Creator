// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    configurator = require('./configurator/elementConfigurator.js').configurator;

function toId(word, tail) {
  var id = word.toLowerCase()
               .replace(/\W/g,"-");
  if(id.slice(word.length - tail.length) === tail){
    return id;
  }
  return id.concat(tail);
}

function toHash(collection) {
  var hash = [];

  _.forEach(collection, function (element) {
    hash[element.id] = element;
  });

  return hash;
}

function idValidator(elements, name, tail) {
  var id = toId(name, tail),
      duplicates = _.filter(elements, function (element) { return  _.includes(element.id,id)});

  if(duplicates.length > 0){
    return id + "-" + duplicates.length;
  }

  return id;
}

function partialModelValidator(model1, model2) {
  console.log('partialModelValidator');
  console.log('model1',model1);
  console.log('model2',model2);
  hashModel1 = toHash(model1);
  console.log('hash', model1);
  _.forEach(model2, function(element){
    console.log('forEach');
    var id = element.id;
    if(hashModel1[id] !== undefined){
      console.log('if');
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
}

exports.toId = toId;
exports.toHash = toHash;
exports.idValidator = idValidator;
exports.partialModelValidator = partialModelValidator;
