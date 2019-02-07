// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

exports.commands = {
    addBinding: require('./addBinding.js').addBinding,
    addField: require('./addField.js').addField,
    addFilter: require('./addFilter.js').addFilter,
    addParameter: require('./addParameter.js').addParameter,
    addPattern: require('./addPattern.js').addPattern,
    addResult: require('./addResult.js').addResult,
    connect: require('./connect.js').connect,
    delete: require('./delete.js').deleteElement,
    dragDrop: require('./dragDrop.js').dragDrop,
    generate: require('./generate.js').generate,
    generateViewContainer: require('./generateViewContainer.js').generateViewContainer,
    insert: require('./insert.js').insert,
    insertEvent: require('./insertEvent.js').insertEvent,
    modelGenerator: require('./modelGenerator.js').modelGenerator,
    moveBoard: require('./moveBoard.js').moveBoard,
    removeBinding: require('./removeBinding.js').removeBinding,
    removeField: require('./removeField.js').removeField,
    removeFilter: require('./removeFilter.js').removeFilter,
    removeParameter: require('./removeParameter.js').removeParameter,
    removeResult: require('./removeResult.js').removeResult,
    resize: require('./resize.js').resize,
    setCollection: require('./setCollection.js').setCollection,
    setContainer: require('./setContainer.js').setContainer,
    setElementName: require('./setElementName.js').setElementName,
    setEventType: require('./setEventType.js').setEventType,
    selectElement: require('./selectElement.js').selectElement,
    selectFlow: require('./selectFlow.js').selectFlow,
    zoom: require('./zoom.js').zoom
}
