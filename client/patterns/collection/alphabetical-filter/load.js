// Copyright (c) 2index18, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    idValidator = require('../../../js/ifml/utilities/validator/idValidator.js').idValidator,
    toHash = require('../../../js/ifml/utilities/validator/toHash.js').toHash,
    configurator = require('../../../js/ifml/utilities/configurator/elementConfigurator.js').configurator,
    generator = require('../../../js/ifml/utilities/generator/elementGenerator.js').generator,
    graphBuilder = require('../../utilities/graphBuilder.js').graphBuilder,
    format = require('./default.json');

function load(cell) {
    var tree = cell.attributes.pattern[0].tree;

    return {
        type: 'update',
        name: cell.attributes.name,
        filterField: tree['alphabet-list'].attributes.fields[0],
        filterCollection: tree['alphabet-list'].attributes.collection,
        resultsCollection: tree['results-list'].attributes.collection,
        selectedDetailsName: tree['result-details'].attributes.name,
        resultsFields: tree['results-list'].attributes.fields,
        selectedFields: tree['result-details'].attributes.fields
    }
}

exports.load = load;
