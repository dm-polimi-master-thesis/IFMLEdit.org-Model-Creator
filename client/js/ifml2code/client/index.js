// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    modelRules = require('./modelrules').rules,
    elementRules = require('./elementrules').rules,
    extensionRules = require('./extensionrules').rules,
    createTransformer = require('almost').createTransformer;

exports.transform = createTransformer({
    model: modelRules,
    element: _.flattenDeep(elementRules,extensionRules)
}, 'm2t');
