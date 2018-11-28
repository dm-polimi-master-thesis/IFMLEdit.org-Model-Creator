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
            return model.isViewComponentExtension(element);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    type: element.type,
                    name: element.attributes.name,
                    stereotype: element.attributes.stereotype
                }
            };
        }
    ),
    createRule(
        function (element, model) {
            return model.isViewComponentExtension(element) && ['breadcrumbs'].includes(element.attributes.stereotype);
        },
        function (element) {
            return {
                elements: {
                    id: element.id,
                    collection: element.attributes.collection || ''
                }
            };
        }
    )
];
