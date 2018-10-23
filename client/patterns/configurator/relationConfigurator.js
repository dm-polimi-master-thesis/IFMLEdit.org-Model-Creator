// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    configureHierarchy = require('./relations/hierarchyConfigurator.js'),
    configureSource = require('./relations/sourceConfigurator.js'),
    configureTarget = require('./relations/targetConfigurator.js');

function configurator(relations, options) {
  switch (element.type) {
    case 'hierarchy':
      configureHierarchy(element, options);
      break;
    case 'source':
      configureSource(element, options);
      break;
    case 'target':
      configureTarget(element, options);
      break;
    default:
      return new Exception('Unexpected relation type');
  }
}

function allConfigurator (type, relations, dross) {
  if(type === 'flow'){
    _.filter(relations, function (relation) { return relation.type !== 'hierarchy'; })
     .map(function(relation){
       return relation.flow = dross.newId;
     });
  } else {
    _.forEach(relations, function(relation){
      if(relation.parent === dross.oldId){
        relation.parent = dross.newId;
      } else if(relation.child === dross.oldId){
        relation.child = dross.newId;
      } else if(relation.source === dross.oldId){
        relation.source = dross.newId;
      } else if(relation.target === dross.oldId){
        relation.target = dross.newId;
      }
    });
  }
}

exports.configurator = configurator;
exports.allConfigurator = allConfigurator;
