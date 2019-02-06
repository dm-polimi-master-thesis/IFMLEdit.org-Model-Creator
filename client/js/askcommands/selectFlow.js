// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var toId = require('../ifml/utilities/validator/toId.js').toId;

function selectFlow(options) {
    var ifmlModel = options.ifmlModel,
        sourceName = options.sourceName,
        targetName = options.targetName,
        sourceType = options.sourceType.toLowerCase().replace(/\W/g,"-"),
        targetType = options.targetType.toLowerCase().replace(/\W/g,"-"),
        flowType = options.flowType.toLowerCase().replace(/\W/g,"-"),
        id = toId('from-' + sourceName + '-' + sourceType + '-to-' + targetName + '-' + targetType, '-' + flowType),
        element = ifmlModel.getCell(id);
        
    return element;
}

exports.selectFlow = selectFlow;
