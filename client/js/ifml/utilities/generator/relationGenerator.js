// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    generateHierarchy = require('./relations/hierarchyGenerator.js').generateHierarchy,
    generateSource = require('./relations/sourceGenerator.js').generateSource,
    generateTarget = require('./relations/targetGenerator.js').generateTarget;

function generator(relations, options) {
  if (!(options.type === 'ifml.NavigationFlow' || options.type === 'ifml.DataFlow')) {
    relations.push(generateHierarchy(options));
  } else {
    relations.push(generateSource(options), generateTarget(options));
  }
}

exports.generator = generator;
