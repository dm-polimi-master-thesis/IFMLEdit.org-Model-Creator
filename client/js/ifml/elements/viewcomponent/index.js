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
        pattern: [],
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
                var pattern = [],
                    values = [],
                    reset = [],
                    states = [
                      {
                        pattern: 'multilevel master detail',
                        values: ['intermediate step','start step'],
                        value: _.chain(self.attributes.pattern)
                                .filter(function (p) {return p.value === 'multilevel master detail'})
                                .map(function (p) {return p.state})
                                .value()[0] || 'intermediate step'
                      },
                      {
                        pattern: 'wizard',
                        values: ['intermediate step','start step'],
                        value: _.chain(self.attributes.pattern)
                                .filter(function (p) {return p.value === 'wizard'})
                                .map(function (p) {return p.state})
                                .value()[0] || 'intermediate step'
                      },
                      {
                        pattern: 'wizard',
                        values: ['log in','sign up'],
                        value: _.chain(self.attributes.pattern)
                                .filter(function (p) {return p.value === 'sign up and log in'})
                                .map(function (p) {return p.state})
                                .value()[0] || ''
                      }
                    ],
                    cellsById = self.graph.attributes.cells._byId,
                    ancestors = _.map(self.getAncestors(), function (ancestor) { return ancestor.id; });

                _.forEach(_.flattenDeep(ancestors), function (id) {
                    var cellPattern = cellsById[id].attributes.pattern;
                    if(cellPattern){
                        var cellPatternValues = _.map(cellPattern, function (p) { return p.value });
                        values = _.union(values,cellPatternValues);

                        if (_.includes(cellPatternValues,'multilevel master detail') || _.includes(cellPatternValues,'wizard') || _.includes(cellPatternValues,'sign up and log in')) {
                            if (cellPattern[0].type === 'root') {
                                var children = cellsById[id].getEmbeddedCells({deep:'true'});

                                _.chain(children)
                                 .filter(function (child) { return child.attributes.type === 'ifml.ViewComponent' && child.attributes.stereotype !== 'details' && child.attributes.id !== self.attributes.id})
                                 .forEach(function (child) {
                                      var childPattern = child.attributes.pattern;
                                      _.forEach(childPattern, function (p) {
                                          if (p.value === 'multilevel master detail' && child.attributes.stereotype === 'list') {
                                              if (p.state === 'start step') {
                                                  states[0].values = ['intermediate step'];
                                              }
                                          } else if (p.value === 'wizard' && child.attributes.stereotype === 'form') {
                                              if (p.state === 'start step') {
                                                  states[1].values = ['intermediate step'];
                                              }
                                          } else if (p.value === 'sign up and log in' && child.attributes.stereotype === 'form') {
                                              if (p.state === 'log in') {
                                                  states[2].values = _.difference(states[2].values,['log in']);
                                              } else if (p.state === 'sign up') {
                                                  states[2].values = _.difference(states[2].values,['sign up']);
                                              }
                                          }
                                      })
                                 })
                                .value();

                            }
                        }
                    }
                });

                values = _.chain(values)
                 .difference(_.map(self.attributes.pattern, function (p) { return p.value }))
                 .map(function (value) {
                     return {
                         value: value,
                         type: ['node']
                     }
                 })
                 .sortBy('value')
                 .value()

                pattern = {
                    values: values,
                    reset: self.attributes.pattern.length > 0 ? _.sortBy(_.flattenDeep([_.map(self.attributes.pattern, function (p) { return { value: p.value, type: [p.type] } }),values]),'value') : undefined,
                    states: (self.attributes.stereotype === 'list' || self.attributes.stereotype === 'form') ? states : undefined
                }

                switch (self.get('stereotype')) {
                case 'list':
                    return [
                        {property: 'collection', name: 'Collection', type: 'string'},
                        {property: 'filters', name: 'Filters', type: 'stringset'},
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', pattern: pattern}
                    ];
                case 'details':
                    return [
                        {property: 'collection', name: 'Collection', type: 'string'},
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', pattern: pattern}
                    ];
                case 'form':
                    return [
                        {property: 'fields', name: 'Fields', type: 'stringset'},
                        {property: 'pattern', name: 'Pattern', type: 'stringset', pattern: pattern}
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
