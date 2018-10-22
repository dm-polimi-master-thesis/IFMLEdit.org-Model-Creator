// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../toId.js');

function generateDetails(options) {
  return {
      attributes: {
          name: options.name,
          stereotype: 'details',
          fields: options.fields || [],
          collection: options.collection
      },
      metadata: {
          graphics: {
              position: options.position || { x: 0, y: 0 },
              size: options.size || { height: 90, width: 150 }
          }
      },
      id: toId(options.name, '-details'),
      type: 'ifml.ViewComponent'
  }
}

exports.generateDetails = generateDetails;
