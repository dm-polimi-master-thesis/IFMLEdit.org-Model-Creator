// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../utility.js').idValidator,
    toId = require('../../utility.js').toId;

function configureEvent(element, template, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        type: 'element',
        oldId: element.id
      };

  attributes.name = options.text || attributes.name;

  graphics.position = options.position || graphics.position;
  graphics.name = options.name || graphics.name;

  if(options.name !== undefined || options.id !== undefined){
    if(options.id !== undefined){
      element.id = options.id;
    } else if(toId(options.name,'-event') != element.id){
      element.id = idValidator(template.elements, options.name,'-event');
    }
  }

  dross.newId = element.id;
  return dross;
}

exports.configureEvent = configureEvent;
