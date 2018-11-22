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
  switch (options.type) {
    case 'hierarchy':
      configureHierarchy(relations, options);
      break;
    case 'source':
      configureSource(relations, options);
      break;
    case 'target':
      configureTarget(relations, options);
      break;
    default:
      return new Exception('Unexpected relation type');
  }
}

function allConfigurator (relations, options) {
  if(options.type === 'flow'){
    _.filter(relations, function (relation) { return relation.type !== 'hierarchy' && relation.flow === options.oldId; })
     .map(function(relation){
       return relation.flow = options.newId;
     });
  } else {
    _.forEach(relations, function(relation){
      if(relation.parent === options.oldId){
        relation.parent = options.newId;
      } else if(relation.child === options.oldId){
        relation.child = options.newId;
      } else if(relation.source === options.oldId){
        relation.source = options.newId;
      } else if(relation.target === options.oldId){
        relation.target = options.newId;
      }
    });
  }
}

exports.configurator = configurator;
exports.allConfigurator = allConfigurator;
