// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function configureHierarchy(element, options) {
  element.parent = options.parent || element.parent;
  element.child = options.child || element.child;
}

exports.configureHierarchy = configureHierarchy;
