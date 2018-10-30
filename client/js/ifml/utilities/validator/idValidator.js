// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toId = require('./toId.js').toId;

function idValidator(elements, name, tail) {
  var id = toId(name, tail),
      duplicates = _.filter(elements, function (element) { return  _.includes(element.id,id)});

  if(duplicates.length > 0){
    return id + "-" + duplicates.length;
  }

  return id;
}

exports.idValidator = idValidator;
