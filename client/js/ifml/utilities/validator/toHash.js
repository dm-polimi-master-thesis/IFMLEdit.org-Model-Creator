// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function toHash(collection) {
  var hash = [];

  _.forEach(collection, function (element) {
    hash[element.id] = element;
  });
  return hash;
}

exports.toHash = toHash;
