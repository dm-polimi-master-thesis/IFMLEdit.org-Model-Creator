// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

exports.commands = {
    delete: require('./delete.js').deleteElement,
    dragDrop: require('./dragDrop.js').dragDrop,
    generateViewContainer: require('./generateViewContainer.js').generateViewContainer,
    insert: require('./insert.js').insert,
    modelGenerator: require('./modelGenerator.js').modelGenerator,
    moveBoard: require('./moveBoard.js').moveBoard,
    resize: require('./resize.js').resize,
    select: require('./select.js').select,
    zoom: require('./zoom.js').zoom
}
