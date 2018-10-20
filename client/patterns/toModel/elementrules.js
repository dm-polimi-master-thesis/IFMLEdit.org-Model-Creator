// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost'),
    toModel = require('./index.js').toModel,
    Rule = almost.Rule,
    createRule = almost.createRule;

module.exports = [
    createRule(
        function (element, pattern) {
            return pattern.isViewContainer(element);
        },
        function (element, pattern) {
            if(pattern.hasChildren(element)){
                elements = _.flattenDeep(toModel(element.children));
            }
            return {
                elements: {
                    id: element.id,
                    metadata: {
                        graphics: {
                            position: {
                                x: element.prop('position/x'),
                                y: element.prop('position/y')
                            }
                        }
                    }
                }
            };
        }
    ),
    createRule(
      function (element, pattern) {
          return pattern.isEvent(element);
      },
      function (element) {
          var attributes = element.attributes;
          attributes.size = {
            width: 20,
            height: 20
          }
          return {
              attributes: attributes
          }
      }
    )
];
