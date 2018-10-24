// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function configureViewComponent(element, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        type: 'element',
        oldId: element.id
      };

  attributes.name = options.name || attributes.name;
  attributes.fields = options.fields || attributes.fields;

  if (!(attributes.stereotype === 'form')) {
    attributes.collection = options.collection || attributes.collection;
  }
  if (attributes.stereotype === 'list') {
    attributes.filters = options.filters || attributes.filters;
  }

  graphics.position = options.position || graphics.position;
  graphics.size = options.size || graphics.size;

  if(options.name !== undefined){
    if (attributes.stereotype === 'form') {
      element.id = toId(options.name,'-form');
    } else if(attributes.stereotype === 'list') {
      element.id = toId(options.name,'-list');
    } else {
      element.id = toId(options.name,'-details');
    }
  }

  dross.newId = element.id;
  return dross;
}

exports.configureViewComponent = configureViewComponent;
