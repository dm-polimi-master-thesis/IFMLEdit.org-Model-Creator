// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var templates = [];

templates['blog-0000'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0000.json')},
templates['blog-0001'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0001.json')},
templates['blog-0010'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0010.json')},
templates['blog-0011'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0011.json')},
templates['blog-0100'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0100.json')},
templates['blog-0101'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0101.json')},
templates['blog-0110'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0110.json')},
templates['blog-0111'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-0111.json')},
templates['blog-1000'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1000.json')},
templates['blog-1001'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1001.json')},
templates['blog-1010'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1010.json')},
templates['blog-1011'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1011.json')},
templates['blog-1100'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1100.json')},
templates['blog-1101'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1101.json')},
templates['blog-1110'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1110.json')},
templates['blog-1111'] = { model: require('../patterns/voice-assistant/types/blog/templates/blog-1111.json')},
templates['crowdsourcing-00'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/templates/crowdsourcing-00.json')},
templates['crowdsourcing-01'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/templates/crowdsourcing-01.json')},
templates['crowdsourcing-10'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/templates/crowdsourcing-10.json')},
templates['crowdsourcing-11'] = { model: require('../patterns/voice-assistant/types/crowdsourcing/templates/crowdsourcing-11.json')},
templates['demo'] = { model: require('../patterns/voice-assistant/types/demo/demo.json')},
templates['ecommerce-0000'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0000.json')},
templates['ecommerce-0001'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0001.json')},
templates['ecommerce-0010'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0010.json')},
templates['ecommerce-0011'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0011.json')},
templates['ecommerce-0100'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0100.json')},
templates['ecommerce-0101'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0101.json')},
templates['ecommerce-0110'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0110.json')},
templates['ecommerce-0111'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-0111.json')},
templates['ecommerce-1000'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1000.json')},
templates['ecommerce-1001'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1001.json')},
templates['ecommerce-1010'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1010.json')},
templates['ecommerce-1011'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1011.json')},
templates['ecommerce-1100'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1100.json')},
templates['ecommerce-1101'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1101.json')},
templates['ecommerce-1110'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1110.json')},
templates['ecommerce-1111'] = { model: require('../patterns/voice-assistant/types/e-commerce/templates/ecommerce-1111.json')},
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
templates['socialnetwork-000'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-000.json')},
templates['socialnetwork-001'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-001.json')},
templates['socialnetwork-010'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-010.json')},
templates['socialnetwork-011'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-011.json')},
templates['socialnetwork-100'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-100.json')},
templates['socialnetwork-101'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-101.json')},
templates['socialnetwork-110'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-110.json')},
templates['socialnetwork-111'] = { model: require('../patterns/voice-assistant/types/social-network/templates/socialnetwork-111.json')},


exports.templates = templates;
