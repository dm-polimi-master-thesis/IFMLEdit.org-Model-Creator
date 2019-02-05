// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
/*globals BASE_PATH */
"use strict";

var generator = require('../ifml/utilities/generator/elementGenerator.js').generator,
    toId = require('../ifml/utilities/validator/toId.js').toId,
    idValidator = require('../ifml/utilities/validator/idValidator.js').idValidator;

async function addFilter (options) {
    var ifmlModel = options.ifmlModel,
        filterName = options.name,
        elementName = options.element,
        idElement = elementName ? toId(elementName,'-list') : undefined;

    var element = idElement ? ifmlModel.getCell(idElement) : options.selectedElement;

    if (!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.ViewComponent' || element.attributes.stereotype !== 'list') {
        $.notify({message: 'The selected element is not characterized by filters. Select a list element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var filters = element.attributes.filters,
        duplicates = _.filter(filters, function (filter) { return filter.label === filterName });

    if (duplicates.length > 0) {
        $.notify({message: 'Impossible to add the filter. It has the same name of another filter...'}, {allow_dismiss: true, type: 'danger'});
        return;
    } else {
        filters.push({label: filterName, value: filterName, type: 'text', name: ''});
        return;
    }
}

exports.addFilter = addFilter;
