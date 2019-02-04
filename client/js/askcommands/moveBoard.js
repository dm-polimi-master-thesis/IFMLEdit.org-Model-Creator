// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

function moveBoard(options) {
    var ifmlBoard = options.ifmlBoard;

    if (options.times > 4) {
      options.times = 1;
    }
    var move = options.move,
        times = options.times * 300,
        delta = {};

    try {
        switch (move) {
          case 'move up':
            delta.x = 0;
            delta.y = -1;
            break;
          case 'move down':
            delta.x = 0;
            delta.y = 1;
            break;
          case 'move right':
            delta.x = 1;
            delta.y = 0;
            break;
          case 'move left':
            delta.x = -1;
            delta.y = 0;
            break;
          default:
            throw 'Unexpected move request';
            break;
        }
    } catch (exception) {
        console.log(exception);
        ifmlBoard.clearHistory();
        $.notify({message: 'Something goes wrong...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    ifmlBoard.moveBoardVoiceAssistant(times,delta);
}

exports.moveBoard = moveBoard;
