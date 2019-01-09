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
templates['demo'] = { model: require('../patterns/voice-assistant/types/demo/demo.json')},
templates['ecommerce-0000'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0000.json')},
templates['ecommerce-0001'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0001.json')},
templates['ecommerce-0010'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0010.json')},
templates['ecommerce-0011'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0011.json')},
templates['ecommerce-0100'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0100.json')},
templates['ecommerce-0101'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0101.json')},
templates['ecommerce-0110'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0110.json')},
templates['ecommerce-0111'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-0111.json')},
templates['ecommerce-1000'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1000.json')},
templates['ecommerce-1001'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1001.json')},
templates['ecommerce-1010'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1010.json')},
templates['ecommerce-1011'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1011.json')},
templates['ecommerce-1100'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1100.json')},
templates['ecommerce-1101'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1101.json')},
templates['ecommerce-1110'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1110.json')},
templates['ecommerce-1111'] = { model: require('../patterns/voice-assistant/types/e-commerce/ecommerce-1111.json')},
templates['crowdsourcing-00'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/crowdsourcing-00.json')},
templates['crowdsourcing-01'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/crowdsourcing-01.json')},
templates['crowdsourcing-10'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/crowdsourcing-10.json')},
templates['crowdsourcing-11'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/crowdsourcing-11.json')}

exports.templates = templates;
