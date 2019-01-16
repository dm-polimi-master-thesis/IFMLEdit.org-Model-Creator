// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    joint = require('joint'),
    Color = require('color');

function upperFirst(string) {
    if (!string || !string.length) { return string; }
    return string[0].toUpperCase() + string.substring(1).toLowerCase();
}

exports.ViewComponent = joint.shapes.basic.Generic.extend({
    markup: require('./markup.svg'),

    defaults: joint.util.deepSupplement({
        type: 'ifml.ViewComponent',
        size: {width: 150, height: 60},
        name: 'View Component',
        stereotype: 'form',
        attrs: {
            '.': {magnet: 'passive'},
            '.ifml-component-reference-rect' : {'follow-scale': 'auto'},
            '.ifml-component-background-rect': {
                'ref-x': 0,
                'ref-y': 0,
                'ref-width': 1,
                'ref-height': 1,
                ref: '.ifml-component-reference-rect'
            },
            '.ifml-component-binding-rect': {
                visibility: 'hidden',
                'ref-x': 10,
                'ref-y': 0.5,
                'ref-width': -20,
                ref: '.ifml-component-background-rect'
            },
            '.ifml-component-magnet-rect': {
                magnet: true,
                visibility: 'hidden',
                'ref-x': 0,
                'ref-y': 0,
                'ref-width': 1,
                'ref-height': 1,
                ref: '.ifml-component-background-rect'
            },
            '.ifml-component-headline': {
                'ref-x': 0.5,
                'ref-y': 0.5,
                ref: '.ifml-component-background-rect'
            },
            '.ifml-component-binding': {
                visibility: 'hidden',
                'ref-x': 0.5,
                'ref-y': 0.5,
                'ref-width': -10,
                'ref-height': 1,
                'y-alignment': 'middle',
                ref: '.ifml-component-binding-rect'
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    minsize: {width: 150, height: 60},
    padding: {top: 0, right: 0, bottom: 0, left: 0},
    resizable: true,
    isContraint: true,
    requireEmbedding: true,
    fullyContained: true,
    containers: ['ifml.ViewContainer'],

    initialize: function () {
        this.on('change:size', this._sizeChanged, this);
        this.on('change:name change:stereotype', this._headlineChanged, this);
        this.on('change:stereotype', this._stereotypeChanged, this);
        this.on('change:collection', this._collectionChanged, this);
        this.on('change:accent', this._accentChanged, this);
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
        this._sizeChanged();
        this._headlineChanged();
        this._stereotypeChanged();
        this._collectionChanged();
        this._accentChanged();
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

    _headlineChanged: function () {
        this.attr({'.ifml-component-headline': {text: '«' + upperFirst(this.get('stereotype')) + '»\n' + this.get('name') }});
    },

    _stereotypeChanged: function () {
        switch (this.get('stereotype')) {
        case 'details':
        case 'list':
            this.attr({'.ifml-component-headline': {'y-alignment': 'bottom'}});
            this.attr({'.ifml-component-binding-rect': {'visibility': 'visible'}});
            this.attr({'.ifml-component-binding': {'visibility': 'visible'}});
            break;
        default:
            this.attr({'.ifml-component-headline': {'y-alignment': 'middle'}});
            this.attr({'.ifml-component-binding-rect': {'visibility': 'hidden'}});
            this.attr({'.ifml-component-binding': {'visibility': 'hidden'}});
        }
    },

    _collectionChanged: function () {
        var collection = this.get('collection');
        if (collection) {
            this.removeAttr('.binding/fill');
            this.attr({'.ifml-component-binding': {text: '«DataBinding» ' + collection }});
        } else {
            this.attr({'.ifml-component-binding': {fill: 'grey', text: '«DataBinding» none' }});
        }
    },

    editable: function () {
        var self = this;
        return _([{property: 'name', name: 'Name', type: 'string'}])
            .concat((function () {
                switch (self.get('stereotype')) {
                case 'list':
                    var pattern = [],
                        types = [],
                        nodes = [],
                        values = ['alphabetical filter','basic search','content management','faceted search','in-place log in','input data validation','master details','multilevel master details','restricted search','sign up and log in','wizard'],
                        cellsById = this.graph.attributes.cells._byId,
                        ancestors = _.map(this.getAncestors(), function (ancestor) { return ancestor.id; }),
                        embeds = _.map(this.getEmbeddedCells({deep:'true'}), function (embed) { return embed.id; });

                    values = _.difference(values, _.map(this.attributes.pattern, function (p) { return p.value }));
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
                    })

                    if ((types.length === 2 && this.getAncestors().length > 0) || (types.length === 1 && types[0] === 'node')) {
                        pattern = _.flattenDeep([values,nodes]);
                    } else if ((types.length === 2 && this.getAncestors().length === 0) || (types.length === 1 && types[0] === 'root')) {
                        pattern = _.flattenDeep(values)
                    }
                    return [
                        {property: 'collection', name: 'Collection', type: 'string'},
                        {property: 'filters', name: 'Filters', type: 'stringset'},
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', patternTypes: [], patternValues: []}
                    ];
                case 'details':
                    return [
                        {property: 'collection', name: 'Collection', type: 'string'},
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', patternTypes: [], patternValues: []}
                    ];
                case 'form':
                    return [
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', patternTypes: [], patternValues: []}
                    ];
                default:
                    return [];
                }
            }()))
            .value();
    },

    inputs: function () {
        switch (this.get('stereotype')) {
        case 'details':
            return ['id'];
        case 'list':
            var specialValues = _.filter(this.get('filters'), function (f) {
                  return (f.type === 'radio' || f.type === 'checkbox') && (f.name.length > 0);
                }),
                regularValues = _.filter(this.get('filters'), function (f) {
                  return (f.type !== 'radio' && f.type !== 'checkbox');
                });
            return _(_.flattenDeep([_.map(regularValues,'label'), _.uniq(_.map(specialValues,'name'))]) || []).sort().uniq(true).value();
        case 'form':
            var specialValues = _.filter(this.get('fields'), function (f) {
                  return (f.type === 'radio' || f.type === 'checkbox') && (f.name.length > 0);
                }),
                regularValues = _.filter(this.get('fields'), function (f) {
                  return (f.type !== 'radio' && f.type !== 'checkbox');
                });
            return _(_.flattenDeep([_.map(regularValues,'label'), _.uniq(_.map(specialValues,'name'))]) || []).map(function (f) {
                return [f, f + '-error'];
            }).flatten().sort().value()
        default:
            return [];
        }
    },

    outputs: function () {
        switch (this.get('stereotype')) {
        case 'details':
            var specialValues = _.filter(this.get('fields'), function (f) {
                  return (f.type === 'radio' || f.type === 'checkbox') && (f.name.length > 0);
                }),
                regularValues = _.filter(this.get('fields'), function (f) {
                  return (f.type !== 'radio' && f.type !== 'checkbox');
                });
            return _(['id']).concat(_.flattenDeep([_.map(regularValues,'label'), _.uniq(_.map(specialValues,'name'))]) || []).sort().uniq(true).value();
        case 'list':
            var specialValues = _.filter(this.get('fields'), function (f) {
                  return (f.type === 'radio' || f.type === 'checkbox') && (f.name.length > 0);
                }),
                regularValues = _.filter(this.get('fields'), function (f) {
                  return (f.type !== 'radio' && f.type !== 'checkbox');
                });
            return _(['id']).concat(_.flattenDeep([_.map(regularValues,'label'), _.uniq(_.map(specialValues,'name'))]) || []).sort().uniq(true).value();
        case 'form':
            var specialValues = _.filter(this.get('fields'), function (f) {
                  return (f.type === 'radio' || f.type === 'checkbox') && (f.name.length > 0);
                }),
                regularValues = _.filter(this.get('fields'), function (f) {
                  return (f.type !== 'radio' && f.type !== 'checkbox');
                });
            return _(_.flattenDeep([_.map(regularValues,'label'), _.uniq(_.map(specialValues,'name'))]) || []).sort().uniq(true).value()
        default:
            return [];
        }
    },

    magnetize: function () {
        this.attr({'.ifml-component-magnet-rect': {visibility: 'visible'}});
    },

    demagnetize: function () {
        this.attr({'.ifml-component-magnet-rect': {visibility: 'hidden'}});
    },

    _accentChanged: function () {
        var stroke = 'black',
            fill = 'lightgray',
            accent = this.get('accent');
        if (typeof accent === 'number') {
            stroke = Color.hsl(120 * accent, 100, 35).string();
            fill = Color.hsl(120 * accent, 75, 90).string();
        }
        this.attr({
            '.ifml-component-background-rect': {
                stroke: stroke,
                fill: fill
            },
            '.ifml-component-binding-rect': {
                stroke: stroke
            }
        });
    }
});
