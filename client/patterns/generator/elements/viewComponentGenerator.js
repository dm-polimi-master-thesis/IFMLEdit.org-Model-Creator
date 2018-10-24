// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utilities.js').toId;

function generateViewComponent(options) {
  return {
      attributes: {
          name: options.name,
          stereotype: options.stereotype,
          fields: options.fields || undefined,
          collection: options.collection || undefined,
          filters: options.filters || undefined
      },
      metadata: {
          graphics: {
            position: options.position || { x: 0, y: 0 },
            size: options.size || { height: 90, width: 150 }
          }
      },
      id: toId(options.name, '-' + options.stereotype),
      type: 'ifml.ViewComponent'
  }
}

exports.generateViewComponent = generateViewComponent;
