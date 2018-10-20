// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('./toId.js');

function detailsGenerator(options) {
  return {
      attributes: {
          type: 'ifml.ViewComponent',
          stereotype: 'details',
          id: toId(options.name,'-details-view-component'),
          name: options.name,
          fields: options.fields || [],
          collection: options.collection
          events: [],
          dataflow: [],
          parent: options.parent,
          level: 3,
          matrixPos: options.matrixPos || {x: 1, y: 1}
      }
  }
}

exports.detailsGenerator = detailsGenerator;
