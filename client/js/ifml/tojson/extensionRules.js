// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost'),
    Rule = almost.Rule,
    createRule = almost.createRule;

module.exports = [
  createRule(
      function (element, model) {
          return model.isViewComponentExtension(element);
      },
      function (element) {
          return {
              elements: {
                  id: element.id,
                  attributes: {
                      name: element.get('name'),
                      stereotype: element.get('stereotype')
                  },
              }
          };
      },

  ),
  createRule(
      function (element, model) {
          return model.isBreadcrumbs(element);
      },
      function (element) {
          return {
              elements: {
                  id: element.id,
                  attributes: {
                      collection: element.get('collection') || ''
                  },
              }
          };
      },

  )
];
