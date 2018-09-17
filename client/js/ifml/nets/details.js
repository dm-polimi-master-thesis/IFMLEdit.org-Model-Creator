// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true */
"use strict";

var elements = require('../elements').elements,
    links = require('../links').links;

function createDetails() {
    return [
        new elements.ViewComponent({position: {x: 0, y: 0}, stereotype: 'details'})
    ];
}

exports.createDetails = createDetails;
