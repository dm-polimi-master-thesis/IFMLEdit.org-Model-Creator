// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function configureEvent(element, relations, options) {
  var attributes = element.attributes,
      graphics = element.metadata.graphics,
      dross = {
        oldId: element.id
      };

  attributes.name = options.name || attributes.name;

  graphics.position = options.position || graphics.position;
  graphics.name = options.name || graphics.name;

  element.id = toId(options.name,'-event');

  dross.newId = element.id;
  return dross;
}

exports.configureEvent = configureEvent;
