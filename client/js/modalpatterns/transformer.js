// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function toViewelement(element, index, collection, pattern) {
  return {
    default : element.default || false,
    id : element.id,
    landmark : element.landmark || false,
    name : element.name,
    parent : element.parent || undefined,
    type : "ifml.ViewContainer",
    xor : element.xor || false
  }
}
