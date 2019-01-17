// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    joint = require('joint'),
    Color = require('color');

function ignore() { return undefined; }

exports.ViewContainer = joint.shapes.basic.Generic.extend({
    markup: require('./markup.svg'),

    defaults: joint.util.deepSupplement({
        type: 'ifml.ViewContainer',
        size: {width: 200, height: 160},
        name: 'View Container',
        'default': false,
        landmark: false,
        pattern: [],
        xor: false,
        attrs: {
            '.': {marker: 'passive'},
            '.ifml-viewcontainer-reference-rect': { 'follow-scale': 'auto' },
            '.ifml-viewcontainer-background-rect': {
                'ref-x': 0,
                'ref-y': 0,
                'ref-width': 1,
                'ref-height': 1,
                ref: '.ifml-viewcontainer-reference-rect'
            },
            '.ifml-viewcontainer-title-rect': {
                'ref-x': 0,
                'ref-y': 0,
                'ref-width': 1,
                ref: '.ifml-viewcontainer-reference-rect'
            },
            text: {
                'ref-x': 5,
                'ref-y': 0.5,
                'ref-width': -10,
                'ref-height': 1,
                'y-alignment': 'middle',
                ref: '.ifml-viewcontainer-title-rect'
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    minsize: {width: 180, height: 100},
    padding: {top: 20, right: 0, bottom: 0, left: 0},
    resizable: true,
    isContraint: true,
    fullyContained: true,
    containers: ['ifml.ViewContainer'],

    initialize: function () {
        this.on('change:size', this._sizeChanged, this);
        this.on('change:name change:default change:landmark change:xor change:pattern', this._nameChanged, this);
        this.on('change:default', this._defaultChanged, this);
        this.on('change:xor', this._xorChanged, this);
        this.on('change:landmark', this._landmarkChanged, this);
        this.on('change:parent', this._parentChanged, this);
        this.on('change:accent', this._accentChanged, this);

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        this._sizeChanged();
        this._nameChanged();
        this._accentChanged();
    },

    editable: function () {
        var graph = this.graph,
            filter = function (id) {
                switch (graph.getCell(id).get('type')) {
                case 'ifml.ViewContainer':
                case 'ifml.ViewComponent':
                case 'ifml.Event':
                    return true;
                default:
                    return false;
                }
            },
            display = function (id) {
                switch (graph.getCell(id).get('type')) {
                case 'ifml.Event':
                    return graph.getCell(id).prop('name/text');
                default:
                    return graph.getCell(id).get('name');
                }
            },
            editables = _.chain([{property: 'name', name: 'Name', type: 'string'}]);
        if (graph) {
            if (this.get('parent') && !this.graph.getCell(this.get('parent')).get('xor')) {
                editables = editables.concat(
                    {name: 'Container Type', type: 'booleanset', items: [
                        {property: 'xor', name: 'XOR', type: 'boolean'}
                    ]}
                );
            } else {
                editables = editables.concat(
                    {name: 'Container Type', type: 'booleanset', items: [
                        {property: 'default', name: 'Default', type: 'boolean'},
                        {property: 'landmark', name: 'Landmark', type: 'boolean'},
                    ]}
                );
            }

            var pattern = [],
                types = [],
                nodes = [],
                values = ['alphabetical filter','basic search','content management','faceted search','in-place log in','input data validation','master details','multilevel master details','restricted search','sign up and log in','wizard'],
                cellsById = this.graph.attributes.cells._byId,
                ancestors = _.map(this.getAncestors(), function (ancestor) { return ancestor.id; }),
                embeds = _.map(this.getEmbeddedCells({deep:'true'}), function (embed) { return embed.id; });

            if (this.attributes.pattern && this.attributes.pattern.length > 0) {
                values = _.difference(values, _.map(this.attributes.pattern, function (p) { return p.value }));

                if (this.attributes.pattern[0].type === 'root') {
                    types = ['root'];
                } else if (this.attributes.pattern[0].type === 'node') {
                    types = ['node'];
                }
            } else {
                types = ['root','node'];
            }

            //if for a pattern value there is a root among the ancestors,
            //the cell could be only a node for that value
            _.forEach(_.flattenDeep(ancestors), function (id) {
                var cellPattern = cellsById[id].attributes.pattern;
                if(cellPattern && cellPattern.length > 0 && cellPattern[0].type === 'root'){
                    cellPattern = _.map(cellPattern, function (p) { return p.value});

                    var commonRoots = _.intersection(cellPattern,values);

                    values = _.difference(values,commonRoots);

                    commonRoots = _.map(commonRoots, function (c) {
                        return {
                            value: c,
                            type: ['node']
                        }
                    });

                    nodes.push(commonRoots);
                }
            });

            //if for a pattern value there is a corresponding root among the embeds,
            //the cell cannot be part of the pattern nor as root neither as node
            _.forEach(_.flattenDeep(embeds), function (id) {
                var cellPattern = cellsById[id].attributes.pattern;
                if(cellPattern && cellPattern.length > 0 && cellPattern[0].type === 'root'){
                    cellPattern = _.map(cellPattern, function (p) { return p.value});
                    values = _.difference(values,cellPattern);
                }
            });

            //the remainers can be only root because there is not a corresponding ancestor root
            values = _.map(values, function (v) {
                return {
                  value: v,
                  type: ['root']
                }
            });

            if ((types.length === 2 && this.getAncestors().length > 0)) {
                pattern = {
                    values: _.sortBy(_.flattenDeep([values,nodes]),'value')
                }
            } else if ((types.length === 2 && this.getAncestors().length === 0) || (types.length === 1 && types[0] === 'root')) {
                pattern = {
                    values: _.sortBy(_.flattenDeep(values),'value')
                }
            } else if (types.length === 1 && types[0] === 'node') {
                pattern = {
                    values: _.sortBy(_.flattenDeep(nodes),'value'),
                    reset: _.sortBy(_.flattenDeep([_.map(this.attributes.pattern, function (p) { return { value: p.value, type: [p.type] } }),nodes,values]),'value')
                }
            }

            editables = editables.concat(
                {property: 'pattern', name: 'Pattern', type: 'stringset', pattern: pattern},
                {property: 'embeds', name: 'Children', type: 'elementslist', filter: filter, display: display}
            );
        }
        return editables.value();
    },

    statistics: function () {
        return this.get('statistics');
    },

    _sizeChanged: function () {
        var size = this.get('size'),
            minsize = this.minsize;
        if (size.width < minsize.width || size.height < minsize.height) {
            this.resize(Math.max(size.width, minsize.width), Math.max(size.height, minsize.height));
        }
    },

    _defaultChanged: function () {
        if (this.get('default') === true && this.graph) {
            var parent = this.graph.getCell(this.get('parent')),
                thisId = this.id,
                siblings;
            if (parent) {
                if (!parent.get('xor')) {
                    this.set('default');
                    return;
                }
                siblings = parent.getEmbeddedCells();
            } else {
                siblings = _.filter(
                    this.graph.getCells(),
                    function (cell) {
                        return !cell.get('parent');
                    }
                );
            }
            _.chain(siblings)
                .filter(function (sibling) {
                    return sibling && !sibling.isLink() && sibling.get('type') === 'ifml.ViewContainer' &&
                        sibling.get('default') && sibling.id !== thisId;
                })
                .invoke('set', 'default')
                .run();
        }
    },

    _xorChanged: function () {
        if (this.get('xor') === true && this.graph) {
            var parent = this.getAncestors()[0];
            if (!parent || parent.get('xor')) {
                this.set('xor');
            }
        }
    },

    _landmarkChanged: function () {
        if (this.get('landmark') === true && this.graph) {
            var parent = this.getAncestors()[0];
            if (parent && !parent.get('xor')) {
                this.set('landmark');
            }
        }
    },

    _parentChanged: function (element, value, data) {
        ignore(element, value);
        data = data ||  {};
        if (this.graph) {
            var parent = this.graph.getCell(this.previous('parent'));
            if (parent) {
                parent.off('change:xor', this._xorChanged, this);
                parent.off('change:xor', this._landmarkChanged, this);
                parent.off('change:xor', this._defaultChanged, this);
            }
            if (data.reparenting) { return; }
            parent = this.graph.getCell(this.get('parent'));
            if (parent) {
                parent.on('change:xor', this._xorChanged, this);
                parent.on('change:xor', this._landmarkChanged, this);
                parent.on('change:xor', this._defaultChanged, this);
            }
            this._xorChanged();
            this._landmarkChanged();
            this._defaultChanged();
        }
    },

    _nameChanged: function () {
        var value,
            modifiers = [];
        if (this.get('pattern') && this.get('pattern').length > 0) {
            modifiers.push('P');
        }
        if (this.get('default')) {
            modifiers.push('D');
        }
        if (this.get('landmark')) {
            modifiers.push('L');
        }
        if (this.get('xor')) {
            modifiers.push('XOR');
        }
        if (modifiers.length) {
            value = '[' + modifiers.join(',') + ']' + this.get('name');
        } else {
            value = this.get('name');
        }
        this.attr({text: {text: value }});
    },

    _accentChanged: function () {
        var stroke = 'black',
            fill = 'white',
            accent = this.get('accent');
        if (typeof accent === 'number') {
            stroke = Color.hsl(120 * accent, 100, 35).string();
            fill = Color.hsl(120 * accent, 75, 90).string();
        }
        this.attr({
            '.ifml-viewcontainer-background-rect': {
                stroke: stroke,
                fill: fill
            },
            '.ifml-viewcontainer-title-rect': {
                stroke: stroke,
                fill: fill
            }
        });
    }
});
