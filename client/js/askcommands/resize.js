// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function resize(options) {
    var ifmlBoard = options.ifmlBoard,
        ifmlModel = options.ifmlModel,
        name = options.name,
        type = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = name ? toId(name,'-' + type) : undefined,
        direction,
        delta = options.delta;

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (element) {
        try {
            switch (options.direction) {
              case 'up':
                direction = 'n'
                break;
              case 'down':
                direction = 's'
                break;
              case 'right':
                direction = 'e'
                break;
              case 'left':
                direction = 'w'
                break;
              default:
                throw 'Unexpected resize request';
                break;
            }
        } catch (exception) {
            console.log(exception);
            ifmlBoard.clearHistory();
            $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
            return;
        }

        ifmlBoard.resizeElementVoiceAssistant(element,delta,direction);
    } else {
        $.notify({message: 'Element not found... Select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

exports.resize = resize;
