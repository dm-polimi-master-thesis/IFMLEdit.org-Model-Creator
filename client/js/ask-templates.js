// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var templates = [];

templates['IFML 2'] = { model: require('../examples/ifml2.json') },
templates['IFML 3'] = { model: require('../examples/ifml3.json') },
templates['IFML 4'] = { model: require('../examples/ifml4.json')},
templates['IFML 5'] = { model: require('../examples/ifml5.json')},
templates['IFML 6'] = { model: require('../examples/ifml6.json')},
templates['IFML 7'] = { model: require('../examples/ifml7.json')},
templates['IFML 8'] = { model: require('../examples/ifml8.json')},
templates['IFML 8 Multi Page'] = { model: require('../examples/ifml8-multi-page.json')},
templates['IFML 9'] = { model: require('../examples/ifml9.json')},
templates['IFML 10'] = { model: require('../examples/ifml10.json')},
templates['IFML 11'] = { model: require('../examples/ifml11.json')},
templates['IFML 12'] = { model: require('../examples/ifml12.json')},
templates['IFML 13'] = { model: require('../examples/ifml13.json')},
templates['demo'] = { model: require('../patterns/voice-assistant/types/demo/demo.json')}

exports.templates = templates;
