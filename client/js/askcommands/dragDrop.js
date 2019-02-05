// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function dragDrop(options) {
    var ifmlBoard = options.ifmlBoard,
        ifmlModel = options.ifmlModel,
        name = options.name,
        type = options.type ? options.type.toLowerCase().replace(/\W/g,"-") : undefined,
        id = name ? toId(name,'-' + type) : undefined,
        firstDirection = options.firstDirection,
        firstDelta = options.firstDelta,
        secondDirection = options.secondDirection,
        secondDelta = options.secondDelta,
        delta = {
            x: 0,
            y: 0
        };

    var element = id ? ifmlModel.getCell(id) : options.selectedElement;

    if (element) {
        try {
            switch (firstDirection) {
              case 'up':
                delta.y -= firstDelta;
                break;
              case 'down':
                delta.y += firstDelta;
                break;
              case 'right':
                delta.x += firstDelta;
                break;
              case 'left':
                delta.x -= firstDelta;
                break;
              default:
                throw 'Unexpected move request';
                break;
            }

            if (secondDirection && secondDelta) {
                switch (secondDirection) {
                  case 'up':
                    delta.y -= secondDelta;
                    break;
                  case 'down':
                    delta.y += secondDelta;
                    break;
                  case 'right':
                    delta.x += secondDelta;
                    break;
                  case 'left':
                    delta.x -= secondDelta;
                    break;
                  default:
                    throw 'Unexpected move request';
                    break;
                }
            }
        } catch (exception) {
            console.log(exception);
            ifmlBoard.clearHistory();
            $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
            return;
        }

        ifmlBoard.dragDropElementVoiceAssistant(element,delta);
    } else {
        $.notify({message: 'Element not found... Select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

exports.dragDrop = dragDrop;
