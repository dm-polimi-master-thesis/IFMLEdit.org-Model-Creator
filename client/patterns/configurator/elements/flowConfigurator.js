// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function configureFlow(element, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        oldId: element.id
      };

  var bindings = _.map(options.fields, function(field){
    return {
      input: field,
      output: field
    }
  });

  attributes.bindings = bindings;

  if(options.vertices !== undefined){
      graphics.vertices = options.vertices || graphics.vertices;
  }

  if(options.name !== undefined){
    if(element.type === 'ifml.NavigationFlow'){
      element.id = toId(options.name,'-navigation-flow');
    } else {
      element.id = toId(options.name,'-data-flow');
    }
  }

  dross.newId = element.id;
  return dross;
}

exports.configureFlow = configureFlow;
