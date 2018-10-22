// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function configureAction(element, relations, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        oldId: element.id
      };

  attributes.name = options.name || attributes.name;
  attributes.parameters = options.parameters || attributes.parameters;
  attributes.results = options.results || attributes.results;

  graphics.position = options.position || graphics.position;
  graphics.size = options.size || graphics.size;
  graphics.parent = options.parent || graphics.parent;

  element.id = toId(options.name,'-action');

  dross.newId = element.id;
  return dross;
}

exports.configureAction = configureAction;
