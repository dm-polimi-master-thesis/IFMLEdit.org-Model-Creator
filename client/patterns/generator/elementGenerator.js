// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    generateViewContainer = require('./elements/viewContainerGenerator.js').generateViewContainer,
    generateViewComponent = require('./elements/viewComponentGenerator.js').generateViewComponent,
    generateAction = require('./elements/actionGenerator.js').generateAction,
    generateEvent= require('./elements/eventGenerator.js').generateEvent,
    generateFlow = require('./elements/flowGenerator.js').generateFlow,
    generateRelations = require('./relationGenerator.js').generator;

function generator(relations, options) {
  var element;
  switch (options.type) {
    case 'ifml.ViewContainer':
      element = generateViewContainer(options);
      break;
    case 'ifml.ViewComponent':
      element = generateViewComponent(options);
      break;
    case 'ifml.Action':
      element = generateAction(options);
      break;
    case 'ifml.Event':
      element = generateEvent(options);
      break;
    case 'ifml.NavigationFlow':
    case 'ifml.DataFlow':
      element = generateFlow(options);
      break;
    default:
      throw 'Unexpected element type';
  }

  options.id = element.id;
  generateRelations(relations, options);
  return element;
}

exports.generator = generator;
