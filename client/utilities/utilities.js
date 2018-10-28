// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    configurator = require('./configurator/elementConfigurator.js').configurator;

function toId(word, tail) {
  var id = word.toLowerCase().replace(/\W/g,"-");
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
  console.log("idValidator");
  var id = toId(name, tail),
      duplicates = _.filter(elements, function (element) { return  _.includes(element.id,id)});

  if(duplicates.length > 0){
    return id + "-" + duplicates.length;
  }

  return id;
}

function partialModelValidator(model1, model2) {
  try{
  var hashModel1 = toHash(model1.elements);
  //console.log("- model2 -", model2);
  //console.log("elements", model2.elements);
  _.forEach(model2.elements, function(element){
    var id = element.id;
    //console.log("element", element);
    //console.log("id",id);
    if(hashModel1[id] !== undefined){
      //console.log("hash ≠ undefined!");
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
} catch (err){
  console.log(err);
}
  console.log("model2", model2);

  return model2;
}

exports.toId = toId;
exports.toHash = toHash;
exports.idValidator = idValidator;
exports.partialModelValidator = partialModelValidator;
