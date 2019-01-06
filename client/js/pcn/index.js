// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true */
"use strict";

var pcn = { };

exports.pcn = pcn;

pcn.extend = require('./extender').extend;
pcn.fromJSON = require('./fromjson').fromJSON;
pcn.elements = require('./elements').elements;
pcn.links = require('./links').links;
pcn.nets = require('./nets').nets;
pcn.Simulator = require('./simulate').Simulator;
