// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

function zoom(options) {
    var ifmlBoard = options.ifmlBoard;

    if (options.times > 4) {
      options.times = 1;
    }
    var delta = options.zoom === 'zoom in' ? 0.4 : -0.4,
        zoom = options.zoom,
        times = options.times * 20;

    ifmlBoard.zoomVoiceAssistant(times,delta);
}

exports.zoom = zoom;
