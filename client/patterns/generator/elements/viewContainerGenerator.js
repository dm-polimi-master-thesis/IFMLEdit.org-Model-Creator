// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function generateViewContainer(options) {
  return {
      attributes: {
          name: options.name,
          default: options.default || false,
          landmark: options.landmark || false,
          xor: options.xor || false
      },
      metadata: {
         graphics: {
            position: options.position || { x: 0, y: 0 },
            size: options.size || { height: 150, width: 190 }
         }
      },
      id: toId(options.name,'-view-container'),
      type : 'ifml.ViewContainer'
  }
}

exports.generateViewContainer = generateViewContainer;
