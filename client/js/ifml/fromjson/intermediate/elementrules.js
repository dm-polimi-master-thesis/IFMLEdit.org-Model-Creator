// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var almost = require('almost'),
    createRule = almost.createRule;

module.exports = [
    createRule(
        function (element, model) {
            return model.isPositionedElement(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    position: element.metadata.graphics.position
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isSizedElement(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    size: element.metadata.graphics.size
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isElementWithStats(element) &&
                element.metadata.statistics;
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    statistics: element.metadata.statistics.slice()
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isFlow(element) &&
                element.metadata.graphics && element.metadata.graphics.vertices;
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    vertices: element.metadata.graphics.vertices
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isEvent(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    name: {
                        text: element.attributes.name,
                        horizontal: element.metadata.graphics.name.horizontal,
                        vertical: element.metadata.graphics.name.vertical
                    },
                    stereotype: element.attributes.stereotype
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isAction(element) &&
                element.metadata.graphics.parent;
        },
        function (element) {
            return {
                elements: [{
                    id: element.id,
                    parent: element.metadata.graphics.parent
                }, {
                    id: element.metadata.graphics.parent,
                    embeds: element.id
                }]
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isViewContainer(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type,
                    name: element.attributes.name,
                    'default': element.attributes.default,
                    landmark: element.attributes.landmark,
                    xor: element.attributes.xor,
                    pattern: element.attributes.pattern || undefined
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isViewComponent(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type,
                    name: element.attributes.name,
                    stereotype: element.attributes.stereotype,
                    fields: (element.attributes.fields && _.map(element.attributes.fields, function (el) {
                      if(element.attributes.stereotype === 'form'){
                        return {
                          label: el.label || el,
                          value: el.value || el,
                          type: el.type || 'text',
                          name: (el.type === 'radio' || el.type === 'checkbox') ? (el.name || '') : undefined
                        };
                      } else {
                        return {
                          label: el.label || el
                        };
                      }
                    }).slice()) || []
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isViewComponent(element) && ['list', 'details'].includes(element.attributes.stereotype);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    collection: element.attributes.collection || ''
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isViewComponent(element) &&
                element.attributes.stereotype === 'list';
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    filters: (element.attributes.filters && _.map(element.attributes.filters, function (el) { return { label: el.label || el };}).slice()) || []
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isEvent(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isAction(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type,
                    name: element.attributes.name,
                    results: (element.attributes.results && _.map(element.attributes.results, function (el) { return { label: el.label || el };}).slice()) || [],
                    parameters: (element.attributes.parameters && _.map(element.attributes.parameters, function (el) { return { label: el.label || el };}).slice()) || []
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isFlow(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type,
                    bindings: element.attributes.bindings
                }
            };
        }
    )
];
