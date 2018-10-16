// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function toId(word, tail) {
  return word.toLowerCase()
             .replace(/\W/g,"-")
             .concat(tail);
}

function toViewelement(element, index, collection, pattern) {
  var viewContainer;

  element.id = nameToId(step.name, wizard.name.concat('-view-element'));
  element.name = step.name;
  element.landmark = element.landmark !== undefined ? element.landmark : false;
  element.default = element.default !== undefined ? element.default : false;
  element.parent = element.parent !== undefined ? element.parent : toId(wizard.name, '-view-container');
}

exports.toId = toId;
