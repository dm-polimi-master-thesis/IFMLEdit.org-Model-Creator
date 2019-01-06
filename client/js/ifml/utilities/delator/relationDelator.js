// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function delator (id, relations) {
  _.remove(relations, function (relation) {
    switch (relation.type) {
      case 'hierarchy':
        return relation.parent === id || relation.child === id;
        break;
      case 'source':
        return relation.flow === id || relation.source === id;
        break;
      case 'target':
        return relation.flow === id || relation.target === id;
        break;
      default:
        throw 'Unexpected relation type';
    }
  })
}

exports.delator = delator;
