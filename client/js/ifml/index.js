// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true */
"use strict";

var ifml = { };

exports.ifml = ifml;

ifml.elements = require('./elements').elements;
ifml.extensions = require('./extensions').extensions;
ifml.links = require('./links').links;
ifml.nets = require('./nets').nets;
ifml.toJSON = require('./tojson').toJSON;
ifml.fromJSON = require('./fromjson').fromJSON;
ifml.extend = require('./extender').extend;
