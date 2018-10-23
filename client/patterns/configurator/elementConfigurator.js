// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    configureViewContainer = require('./elements/viewContainerConfigurator.js').configureViewContainer,
    configureViewComponent = require('./elements/viewComponentConfigurator.js').configureViewComponent,
    configureAction = require('./elements/actionConfigurator.js').configureAction,
    configureEvent= require('./elements/eventConfigurator.js').configureEvent,
    configureFlow = require('./elements/flowConfigurator.js').configureFlow,
    relationsUpdate = require('./relationConfigurator.js').allConfigurator;

function configurator(element, relations, options) {
  var dross;
  switch (element.type) {
    case 'ifml.ViewContainer':
      dross = configureViewContainer(element, options);
      break;
    case 'ifml.ViewComponent':
      dross = configureViewComponent(element, options);
      break;
    case 'ifml.Action':
      dross = configureAction(element, options);
      break;
    case 'ifml.Event':
      dross = configureEvent(element, options);
      break;
    case 'ifml.NavigationFlow':
    case 'ifml.DataFlow':
      dross = configureFlow(element, options);
      if(dross.oldId !== dross.newId){
        relationsUpdate('flow', relations, dross);
      }
      break;
    default:
      return new Exception('Unexpected element type');
  }

  if (!(element.type === 'ifml.NavigationFlow' || element.type === 'ifml.DataFlow')) {
    if(dross.oldId !== dross.newId){
      relationsUpdate('general', relations, dross);
    }
  }
}

exports.configurator = configurator;
