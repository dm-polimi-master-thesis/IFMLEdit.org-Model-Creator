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

async function addBinding (options) {
    var ifmlModel = options.ifmlModel,
        input = options.input,
        output = options.output,
        elementName = options.element,
        elementType = options.elementType ? options.elementType.toLowerCase().replace(/\W/g,"-") : undefined,
        idElement = elementName && elementType ? toId(elementName,'-' + elementType) : undefined;

    var element = idElement ? ifmlModel.getCell(idElement) : options.selectedElement;

    if (!element) {
        $.notify({message: 'Element not found... Repeat the command and select an existing element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
    if (element.attributes.type !== 'ifml.NavigationFlow' && element.attributes.type !== 'ifml.DataFlow') {
        $.notify({message: 'The selected element is not characterized by bindings. Select a link element.'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    var source = ifmlModel.getCell(element.attributes.source.id),
        target = ifmlModel.getCell(element.attributes.target.id),
        sourceFields = [],
        targetFields = [];

    switch (source.attributes.type) {
      case 'ifml.ViewComponent':
        sourceFields = source.attributes.fields;
        break;
      case 'ifml.Action':
        sourceFields = source.attributes.results;
        break;
      case 'ifml.Event':
        var parent = ifmlModel.getCell(source.attributes.parent);

        if (parent.attributes.type === 'ifml.ViewComponent') {
          sourceFields = parent.attributes.fields;
        } else if (parent.attributes.type === 'ifml.Action') {
            sourceFields = parent.attributes.results;
        }
    }

    switch (target.attributes.type) {
      case 'ifml.ViewComponent':
        if(target.attributes.stereotype === 'list') {
            targetFields = target.attributes.filters;
        } else if (target.attributes.stereotype === 'form') {
            targetFields = target.attributes.fields;
        } else {
            targetFields = ['id'];
        }
        break;
      case 'ifml.Action':
        targetFields = target.attributes.parameters;
        break;
    }

    sourceFields = _.filter(sourceFields, function (field) { return field.label === output });
    targetFields = _.filter(targetFields, function (field) { return field.label === input });

    var bindings = element.attributes.bindings,
        duplicates = _.filter(bindings, function (binding) { return binding.input === input && binding.output === output });

    if (duplicates.length > 0) {
        $.notify({message: 'The binding is already present...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }

    if (sourceFields.length > 0 && targetFields > 0) {
        element.attributes.bindings.push({ input: input, output: output });
    } else {
        $.notify({message: 'Input or output field not present in the target or source element...'}, {allow_dismiss: true, type: 'danger'});
        return;
    }
}

exports.addBinding = addBinding;
