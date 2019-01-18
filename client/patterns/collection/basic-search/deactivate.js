// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function deactivate(cell) {
    var tree = cell.attributes.pattern[0].tree;

    _.chain(tree['pattern-container'].attributes.pattern)
     .filter(function (p) {return p.active && p.value === 'basic search'})
     .map(function (p) { return p.active = false })
     .value();
    _.chain(tree['keyword-form'].attributes.pattern)
     .filter(function (p) {return p.active && p.value === 'basic search'})
     .map(function (p) { return p.active = false })
     .value();
    _.chain(tree['results-list'].attributes.pattern)
     .filter(function (p) {return p.active && p.value === 'basic search'})
     .map(function (p) { return p.active = false })
     .value();
    _.chain(tree['result-details'].attributes.pattern)
     .filter(function (p) {return p.active && p.value === 'basic search'})
     .map(function (p) { return p.active = false })
     .value();
}

exports.deactivate = deactivate;
