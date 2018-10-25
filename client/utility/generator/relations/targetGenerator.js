// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var toId = require('../../utility.js').toId;

function generateTarget(options) {
    return {
        type: 'target',
        flow: options.id,
        target: options.target
    }
}

exports.generateTarget = generateTarget;
