// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    relationsUpdate = require('./relationDelator.js').delator;

function delator(ids, template) {
  _.forEach(ids, function (id) {
    _.remove(template.elements, function (element) {
      return element.id === id;
    })

    relationsUpdate(id, template.relations);
  });
}

exports.delator = delator;
