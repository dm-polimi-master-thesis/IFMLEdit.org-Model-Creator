// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function configureViewContainer(element, relations, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        oldId: element.id
      };

  attributes.name = options.name || attributes.name;
  attributes.default = options.default || attributes.default;
  attributes.landmark = options.landmark || attributes.landmark;
  attributes.xor = options.xor || attributes.xor;

  graphics.position = options.position || graphics.position;
  graphics.size = options.size || graphics.size;

  element.id = toId(options.name,'-view-container');

  dross.newId = element.id;
  return dross;
}

export.configureViewContainer = configureViewContainer;
