// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('./toId.js');

function viewContainerGenerator(options) {
  return {
      attributes: {
          type : 'ifml.ViewContainer',
          id: toId(options.name,'-view-container'),
          name: options.name,
          default: options.default || false,
          landmark: options.landmark || false,
          xor: options.xor || false,
          parent: options.parent || undefined,
          viewContainers: [],
          form: [],
          list: [],
          details: [],
          actions: [],
          events: [],
          level: options.level || 0,
          matrixPos: options.matrixPos || {x: 1, y: 1}
  }
}

exports.viewContainerGenerator = viewContainerGenerator;
