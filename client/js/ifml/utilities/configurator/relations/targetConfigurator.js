// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function configureTarget(element, options) {
  element.flow = options.flow || element.flow;
  element.target = options.target || element.target;
}

exports.configureTarget = configureTarget;
