// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator;

function generateAction(template, options) {
  return {
     attributes: {
        name: options.name,
        parameters: options.parameters || [],
        pattern: options.pattern || [],
        results: options.results || []
     },
     metadata: {
        graphics: {
           position: options.position || { x: 0, y: 0 },
           size: options.size || { height: 70, width: 110 },
           parent: options.parent
        }
     },
     id: idValidator(template.elements, options.name,'-action'),
     type : 'ifml.Action'
  }
}

exports.generateAction = generateAction;
