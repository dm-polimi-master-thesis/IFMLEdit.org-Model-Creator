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

function configurator(element, template, options) {
  console.log('entro!');
  var dross;
  switch (element.type) {
    case 'ifml.ViewContainer':
      dross = configureViewContainer(element, template, options);
      break;
    case 'ifml.ViewComponent':
      dross = configureViewComponent(element, template, options);
      break;
    case 'ifml.Action':
      dross = configureAction(element, template, options);
      break;
    case 'ifml.Event':
      dross = configureEvent(element, template, options);
      break;
    case 'ifml.NavigationFlow':
    case 'ifml.DataFlow':
      dross = configureFlow(element, template, options);
      break;
    default:
      throw 'Unexpected element type';
  }

  if(dross.oldId !== dross.newId){
    if (!(element.type === 'ifml.NavigationFlow' || element.type === 'ifml.DataFlow')) {
      relationsUpdate(template.relations, dross);
    } else {
      relationsUpdate(template.relations, dross);
    }

    if (element.type === 'ifml.ViewContainer'){
      _.forEach(template.elements, function(el){
        if(el.type === 'ifml.Action' && el.metadata.graphics.parent === dross.oldId){
          el.metadata.graphics.parent = dross.newId;
        }
      });
    }
  }
}

exports.configurator = configurator;
