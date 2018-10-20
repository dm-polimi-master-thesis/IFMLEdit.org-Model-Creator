// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    createExtender = require('almost-extend').createExtender;

exports.extend = createExtender({
    custom: {
        isViewContainer: function (element) {
            return element.get('type') === 'ifml.ViewContainer';
        },
        isViewComponent: function (element) {
            return element.get('type') === 'ifml.ViewComponent';
        },
        isAction: function (element) {
            return element.get('type') === 'ifml.Action';
        },
        isEvent: function (element) {
            return element.get('type') === 'ifml.Event';
        },
        isDataFlow: function (element) {
            return element.get('type') === 'ifml.DataFlow';
        },
        isNavigationFlow: function (element) {
            return element.get('type') === 'ifml.NavigationFlow';
        },
        isForm: function (element) {
            return this.isViewComponent(element) && element.get('stereotype') === 'form';
        },
        isList: function (element) {
            return this.isViewComponent(element) && element.get('stereotype') === 'list';
        },
        isDetails: function (element) {
            return this.isViewComponent(element) && element.get('stereotype') === 'details';
        },
        isChildElement: function (element) {
            return this.isEvent(element) || this.isViewComponent(element) || (this.isViewContainer(element)
                && element.get('parent'));
        },
        hasChildren: function (element) {
            return element.children !== undefined;
        },
        hasMetadata: function (element) {
            return element.metadata !== undefined;
        }
    }
});
