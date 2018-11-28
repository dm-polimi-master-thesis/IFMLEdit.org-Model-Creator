// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var createExtender = require('almost-extend').createExtender;

exports.extend = createExtender({
    type: {
        'ViewContainer': 'ifml.ViewContainer',
        'ViewComponent': 'ifml.ViewComponent',
        'ViewElement': ['ifml.ViewContainer', 'ifml.ViewComponent'],
        'Action': 'ifml.Action',
        'Event': 'ifml.Event',
        'DataFlow': 'ifml.DataFlow',
        'NavigationFlow': 'ifml.NavigationFlow',
        'Flow': ['ifml.DataFlow', 'ifml.NavigationFlow'],
        'ViewComponentExtension': 'ifml.ViewComponentExtension',
        'ViewExtension': ['ifml.ViewComponentExtension'],
        'PositionedElement': ['ifml.ViewContainer', 'ifml.ViewComponent', 'ifml.Event', 'ifml.Action', 'ifml.ViewComponentExtension'],
        'SizedElement': ['ifml.ViewContainer', 'ifml.ViewComponent', 'ifml.Action', 'ifml.ViewComponentExtension'],
        'ElementWithStats': ['ifml.ViewContainer', 'ifml.ViewComponent', 'ifml.Event', 'ifml.Action', 'ifml.NavigationFlow', 'ifml.DataFlow', 'ifml.ViewComponentExtension'],
        'TargetRelation': 'target',
        'SourceRelation': 'source',
        'HierarchicalRelation' : 'hierarchy'
    }
});
