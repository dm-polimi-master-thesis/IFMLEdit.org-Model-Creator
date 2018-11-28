// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost'),
    createRule = almost.createRule,
    ifml = require('../../').ifml;

module.exports = [
  createRule(
      function (element, model) {
          return model.isViewComponentExtension(element) && model.isBreadcrumbs(element);
      },
      function (element) {
          return new ifml.extensions.Breadcrumbs(element);
      }
  )
]
