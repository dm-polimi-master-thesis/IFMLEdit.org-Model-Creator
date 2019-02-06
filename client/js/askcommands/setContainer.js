// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var _ = require('lodash'),
    generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

function setContainer (options) {
    var ifmlModel = options.ifmlModel,
        elementName = options.element,
        elementType = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = elementName ? toId(elementName,'-view-container') : undefined,
        property = options.property.toLowerCase(),
        operation = options.operation.toLowerCase();

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (!element) {
        $.notify({message: 'The selected element is not a view container or does not exist...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    switch (property) {
      case 'xor':
          var parent = ifmlModel.getCell(element.attributes.parent);

          if (!parent || parent.attributes.xor) {
              $.notify({message: 'The view container lie in a position that does not allow the XOR property...'}, {allow_dismiss: true, type: 'danger'});
              return;
          }
          if (operation === 'add'){
              element.prop('xor', true);
          } else {
              element.prop('xor', false);
          }
          element._xorChanged();
          break;
      case 'default':
          var parent = ifmlModel.getCell(element.attributes.parent);

          if (!element.attributes.xor && (!parent || parent.attributes.xor)) {
              if (operation === 'add'){
                  element.prop('default',true);
              } else {
                  element.prop('default',false);
              }
          } else {
              $.notify({message: 'The view container lie in a position that does not allow the default property...'}, {allow_dismiss: true, type: 'danger'});
              return;
          }
          break;
      case 'landmark':
          var parent = ifmlModel.getCell(element.attributes.parent);

          if (!element.attributes.xor && (!parent || parent.attributes.xor)) {
              if (operation === 'add'){
                  element.prop('landmark',true);
              } else {
                  element.prop('landmark',false);
              }
          } else {
              $.notify({message: 'The view container lie in a position that does not allow the landmark property...'}, {allow_dismiss: true, type: 'danger'});
              return;
          }
          break;
      case 'landmark and default':
          var parent = ifmlModel.getCell(element.attributes.parent);

          if (!element.attributes.xor && (!parent || parent.attributes.xor)) {
              if (operation === 'add'){
                  element.prop('default',true);
                  element.prop('landmark',true);
              } else {
                  element.prop('default',false);
                  element.prop('landmark',false);
              }
          } else {
              $.notify({message: 'The view container lie in a position that does not allow the landmark and default properties...'}, {allow_dismiss: true, type: 'danger'});
              return;
          }
          break;
    }
}

exports.setContainer = setContainer;
