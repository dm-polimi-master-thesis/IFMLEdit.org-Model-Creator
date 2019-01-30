// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator,
    toId = require('../../validator/toId.js').toId;

function generateViewComponent(template, options) {
  return {
      attributes: {
          name: options.name,
          stereotype: options.stereotype,
          fields: options.fields || [],
          collection: options.stereotype !== 'form' ? toId(options.collection,"") || 'defaults' : undefined,
          filters: options.filters || [],
          parent: options.parent,
          pattern: options.pattern || []
      },
      metadata: {
          graphics: {
            position: options.position || { x: 0, y: 0 },
            size: options.size || { height: 90, width: 150 }
          }
      },
      id: idValidator(template.elements, options.name, '-' + options.stereotype),
      type: 'ifml.ViewComponent'
  }
}

exports.generateViewComponent = generateViewComponent;
