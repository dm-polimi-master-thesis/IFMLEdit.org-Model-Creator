// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var elementRules = require('./elementrules'),
    extender = require('../extender'),
    almost = require('almost');

var transformer = almost.createTransformer({
        element: elementRules
    }, almost.core.concat());

exports.toJoint = function (model) {
    return transformer(extender.extend(model));
};
