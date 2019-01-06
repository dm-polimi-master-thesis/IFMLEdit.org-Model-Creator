// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator;

function generateViewContainer(template, options) {
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
      id: idValidator(template.elements, options.name,'-view-container'),
      type : 'ifml.ViewContainer'
  }
}

exports.generateViewContainer = generateViewContainer;
