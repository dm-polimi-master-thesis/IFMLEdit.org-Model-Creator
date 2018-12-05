// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator,
    toId = require('../../validator/toId.js').toId;

function configureViewComponent(element, template, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        type: 'element',
        oldId: element.id
      };

  attributes.name = options.name || attributes.name;
  attributes.fields = options.fields || attributes.fields;

  if (!(attributes.stereotype === 'form')) {
    attributes.collection = toId(options.collection,"") || toId(options.name,"") || attributes.collection || 'defaults';
  }
  if (attributes.stereotype === 'list') {
    attributes.filters = options.filters || attributes.filters;
  }

  graphics.position = options.position || graphics.position;
  graphics.size = options.size || graphics.size;

  if(options.name !== undefined || options.id !== undefined){
    if(options.id !== undefined){
      element.id = options.id;
    } else if (attributes.stereotype === 'form') {
      if(toId(options.name,'-form') != element.id){
        element.id = idValidator(template.elements, options.name,'-form');
      }
    } else if(attributes.stereotype === 'list') {
      if(toId(options.name,'-list') != element.id){
        element.id = idValidator(template.elements, options.name,'-list');
      }
    } else {
      if(toId(options.name,'-details') != element.id){
        element.id = idValidator(template.elements, options.name,'-details');
      }
    }
  }

  dross.newId = element.id;
  return dross;
}

exports.configureViewComponent = configureViewComponent;
