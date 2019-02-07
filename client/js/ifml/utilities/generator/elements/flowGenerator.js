// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var idValidator = require('../../validator/idValidator.js').idValidator;

function generateFlow(template, options) {
    console.log(options.filters);
    var bindings = [];
    if(options.fields !== undefined){
      bindings = _.map(options.fields, function(field){
        return {
          input: field.label,
          output: field.label
        }
      });
    }

    if(options.filters !== undefined){
      bindings = _.map(options.filters, function(filter){
        return {
          input: filter.label,
          output: filter.label
        }
      });
    }
    console.log(bindings);
    console.log(_.flattenDeep(bindings));
    return {
        attributes: {
            bindings: _.flattenDeep(bindings),
            pattern: options.pattern || undefined
        },
        metadata: {
            graphics: {
              vertices: options.vertices || undefined
            }
        },
        id: idValidator(template.elements, options.name, options.type === 'ifml.DataFlow' ? '-data-flow' : '-navigation-flow'),
        type: options.type
    }
}
exports.generateFlow = generateFlow;
