// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

exports.rules = _([])
                .concat(require('./action').rules)
                .concat(require('./event').rules)
                .concat(require('./navigationflow').rules)
                .concat(require('./viewcomponent').rules)
                .concat(require('./viewcontainer').rules)
                .value();
