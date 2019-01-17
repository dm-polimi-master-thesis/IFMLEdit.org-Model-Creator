// Copyright (c) 2016, the ALMOsT project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true, regexp: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    ko = require('knockout'),
    document = require('document'),
    utils = require('almost-joint').utils;

ko.bindingHandlers.executeOnEnter = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        _.noop(valueAccessor);
        var allBindings = allBindingsAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which || event.keyCode);
            if (keyCode === 13) {
                allBindings.executeOnEnter.call(viewModel);
                return false;
            }
            return true;
        });
    }
};

function mapBase(e, f) {
    var field = {
        name: f.name,
        type: f.type,
        property: f.property,
        value: ko.observable(e.prop(f.property))
    };
    field.value.subscribe(function (value) {
        e.prop(f.property, value);
    });
    return field;
}

var mapString = mapBase;
var mapBoolean = mapBase;

function mapBooleanSet(e, f) {
    var field = {
        name: f.name,
        type: f.type,
        items: f.items.map(function (v) { return mapBoolean(e, v); })
    };
    return field;
}

function mapStringSet(e, f, c) {
    var field = {
        name: f.name,
        type: f.type,
        stereotype: e.attributes.stereotype,
        strings: ko.observableArray(e.get(f.property) || []),
        value: ko.observable(''),
        inputTypes: e.attributes.stereotype === 'form' ? ['text','textarea','password','reset','radio','checkbox','hidden','hidden-object'] : undefined,
        inputType: e.attributes.stereotype === 'form' ? ko.observableArray(['text']) : undefined,
        pattern : f.pattern,
        patternTypes: f.name === 'Pattern' ? ko.observableArray(f.pattern.values[0] ? f.pattern.values[0].type : []) : undefined,
        patternType: f.name === 'Pattern' ? ko.observable(f.pattern.values[0] ? f.pattern.values[0].type[0] : '') : undefined,
        patternValues: f.name === 'Pattern' ? ko.observableArray(_.map(f.pattern.values, function (p) {return p.value})) : undefined,
        patternValue: f.name === 'Pattern' ? ko.observable(f.pattern.values[0] ? f.pattern.values[0].value : '') : undefined,
        radio: ko.observable(0),
        checkbox: ko.observable(0),
        add: function () {
            if (field.value().trim().length !== 0 && field.stereotype === 'form' && _.findIndex(field.strings(), {'label' : field.value()}) === -1) {
                field.strings(_(field.strings()).concat({
                  label: field.value().trim(),
                  value: field.value().trim(),
                  type: field.inputType(),
                  name: field.inputType() === 'checkbox' || field.inputType() === 'radio' ? '' : undefined
                }).value());
                if (field.inputType() === 'checkbox' || field.inputType() === 'radio') {
                  var count = 0;
                  if (field.inputType() === 'checkbox') {
                    count = field.checkbox() + 1;
                    field.checkbox(count);
                  } else {
                    count = field.radio() + 1;
                    field.radio(count);
                  }
                }
                field.inputType(['text']);
            } else if (field.value().trim().length !== 0 && _.findIndex(field.strings(), {'label' : field.value()}) === -1) {
                field.strings(_(field.strings()).concat({
                  label: field.value().trim()
                }).value());
            } else if (field.value().trim().length && _.findIndex(field.strings(), {'label' : field.value()}) !== -1) {
                $.notify({message: 'Your request cannot be processed: ' + field.value() + ' is a duplicate.'},
                  {allow_dismiss: true, type: 'danger'});
            } else if (field.value().trim().length === 0) {
                $.notify({message: 'Your request cannot be processed: input field is empty.'},
                  {allow_dismiss: true, type: 'danger'});
            }
            field.value('');
        },
        changePattern: function () {
            var self = this,
                filtered = _.filter(field.pattern.reset || field.pattern.values, function (p) {return p.value === field.patternValue()});
            if(filtered.length > 0){
                field.patternTypes(filtered[0].type);
                field.patternType(filtered[0].type[0]);
            }
        },
        addPattern: function () {
            field.strings(_(field.strings()).concat({
              type: field.patternType(),
              value: field.patternValue(),
              active: false,
            }).value());

            if(field.patternType() === 'root'){
                var list = field.patternValues(),
                    filtered = _.filter(field.pattern.values, function (p) { return _.includes(p.type,'root') && p.value !== field.patternValue(); });
                filtered = _.intersection(list,_.map(filtered, function (l) { return l.value }));
                field.patternValues(filtered);
                field.patternValue(filtered[0] ? filtered[0] : '');
                field.patternValues.sort();
                field.patternTypes(['root']);
                field.patternType('root');
            } else if (field.patternType() === 'node') {
                var list = field.patternValues(),
                    filtered = _.filter(field.pattern.values, function (l) { return _.includes(l.type,'node') && l.value !== field.patternValue(); });

                filtered = _.intersection(list,_.map(filtered, function (p) { return p.value}));
                field.patternValue(filtered[0] ? filtered[0] : '');
                field.patternValues(filtered);
                field.patternValues.sort();
                field.patternTypes(['node']);
                field.patternType('node');
            }
            if(field.patternValues().length < 1){
              field.patternTypes([]);
              field.patternType('');
              $('#pattern-type').prop('disabled',true);
              $('#pattern-value').prop('disabled',true);
              $('#pattern-add').hide();
            }
        },
        remove: function () {
            field.strings.remove(this);
            if(field.name === 'Pattern') {
                field.patternValues.push(this.value);
                field.patternValue(field.patternValues[0]);
                if(this.type === 'root'){
                    var roots = _.filter(field.strings(), function (s) {return _.includes(s.type,'root')});
                    if(roots.length === 0) {
                        if(field.pattern.reset){
                            field.pattern.values = field.pattern.reset;
                            field.patternValues(_.map(field.pattern.values, function (r) { return r.value}));
                            field.patternValue(field.pattern.values[0].value);
                            field.patternTypes(field.pattern.values[0].type);
                            field.patternType(field.pattern.values[0].type[0]);
                        }
                    } else {
                        field.patternTypes(['root']);
                        field.patternType('root');
                    }
                } else if(this.type === 'node'){
                    var nodes = _.filter(field.strings(), function (s) {return _.includes(s.type,'node') });
                    if(nodes.length === 0) {if(field.pattern.reset){
                            field.pattern.values = field.pattern.reset;
                            var filtered = _.filter(field.pattern.values, function (r) { return _.includes(r.type, 'root') });
                            field.patternValues(_.map(field.pattern.values, function (r) { return r.value}));
                            field.patternValue(field.pattern.values[0].value);
                            field.patternTypes(field.pattern.values[0].type);
                            field.patternType(field.pattern.values[0].type[0]);
                        } else {
                            field.patternTypes(['node']);
                            field.patternType('node');
                        }
                    } else {
                        field.patternTypes(['node']);
                        field.patternType('node');
                    }
                }
                if(field.patternValues().length > 0){
                  $('#pattern-type').prop('disabled',false);
                  $('#pattern-value').prop('disabled',false);
                  $('#pattern-add').show();
                }
            }
        },
        scrollHandle: function () {
          var scrollTop = $('#table-cont-' + field.name.toLowerCase()).scrollTop();
          $('#thead-'+ field.name.toLowerCase()).css({'transform' : 'translateY(' + scrollTop + 'px)'});
        },
        validate: function () {
          if (this.name.trim().length && _.findIndex(field.strings(), {'label' : this.name}) !== -1) {
              $.notify({message: 'Your request cannot be processed: ' + this.name + ' has the same name of a field.'},
                {allow_dismiss: true, type: 'danger'});
              $('#' + this.label + '-radio-check-name').val('');
              this.name = '';
          } else {
              this.name = this.name.trim();
          }
        }
    };
    field.strings.subscribe(function (strings) {
        e.prop(f.property, strings);
    });

    return field;
}

function mapEnum(e, f) {
    var field = mapBase(e, f);
    field.values = f.values;
    return field;
}

function mapNumber(e, f) {
    var field = mapBase(e, f);
    field.min = f.min;
    field.max = f.max;
    field.text = ko.pureComputed({
        read: field.value,
        write: function (value) {
            if (value === '' || value === '-') { return; }
            var current = field.value(),
                currentNumber = (f.integer && parseInt(value, 10)) || parseFloat(value, 10) || 0,
                number = currentNumber;
            if (typeof f.min === 'number') { number = Math.max(f.min, number); }
            if (typeof f.max === 'number') { number = Math.min(f.max, number); }
            if (current !== number) {
                field.value(number);
            } else {
                if (currentNumber !== number) {
                    field.value.notifySubscribers(number);
                }
            }
        }
    }).extend({notify: 'always'});
    return field;
}

function mapBindings(l, f) {
    var field = {
        name: f.name,
        type: f.type,
        bindings: ko.observableArray((l.get(f.property) || []).slice()),
        output: ko.observable(),
        input: ko.observable(),
        addBinding: function () {
            if (field.output() && field.input()) {
                field.bindings.push({input: field.input(), output: field.output()});
            }
        },
        removeBinding: function () {
            field.bindings.remove(this);
        }
    };

    field.outputs = (l.getSourceElement().outputs && l.getSourceElement().outputs()) ||
        (l.getSourceElement().getAncestors()[0].outputs && l.getSourceElement().getAncestors()[0].outputs()) ||
        [];
    field.inputs = ko.computed(
        function () {
            return _(l.getTargetElement().inputs())
                .difference(_.map(field.bindings(), function (b) { return b.input; }))
                .value();
        }
    );
    field.bindings.subscribe(function (bindings) {
        l.set(f.property, bindings.slice());
    });
    return field;
}

function mapElementsList(l, f) {
    var elements = l.get(f.property),
        ignored = _.reject(elements, f.filter),
        field = {
            name: f.name,
            type: f.type,
            children: ko.observableArray(_.chain(elements)
                .filter(f.filter)
                .map(function (id) { return {id: id, display: f.display(id)}; })
                .value())
        };
    field.top = function () {
        var index = field.children.indexOf(this);
        if (index > 0) {
            field.children.splice(index, 1);
            field.children.unshift(this);
        }
    };
    field.up = function () {
        var index = field.children.indexOf(this);
        if (index > 0) {
            field.children.splice(index - 1, 2, this, field.children()[index - 1]);
        }
    };
    field.down = function () {
        var index = field.children.indexOf(this);
        if (index < field.children().length - 1) {
            field.children.splice(index, 2, field.children()[index + 1], this);
        }
    };
    field.bottom = function () {
        var index = field.children.indexOf(this);
        if (index < field.children().length - 1) {
            field.children.splice(index, 1);
            field.children.push(this);
        }
    };
    field.children.subscribe(function (sorted) {
        l.set(f.property, _.chain(sorted).map('id').concat(ignored).value());
    });
    return field;
}

function ElementViewModel(options, close) {
    var self = this,
        cell = options.cell,
        cells = options.cells;
    self.id = ko.observable(cell.id);
    self.id_tentative = ko.observable(cell.id);
    self.id_duplicated = ko.observable(false);

    self.id_tentative.subscribe(function (tentative) {

        tentative = tentative.toLowerCase().replace(/[^0-9a-z\-]/gi, '');
        self.id_tentative(tentative);

        if (tentative.length && utils.changeId(cell, tentative)) {
            self.id(tentative);
            self.id_duplicated(false);
        } else {
            self.id_duplicated(true);
        }
    });

    self.fields = _.map(options.fields, function (f) {
        switch (f.type) {
        case 'number':
            return mapNumber(cell, f);
        case 'string':
            return mapString(cell, f);
        case 'stringset':
            return mapStringSet(cell, f, cells);
        case 'boolean':
            return mapBoolean(cell, f);
        case 'enum':
            return mapEnum(cell, f);
        case 'booleanset':
            return mapBooleanSet(cell, f);
        case 'bindings':
            return mapBindings(cell, f);
        case 'elementslist':
            return mapElementsList(cell, f);
        }
    });
    this.close = close;
}

function ModalEdit(options) {
    if (!(this instanceof ModalEdit)) { return new ModalEdit(options); }
    options = options || {};

    if (typeof options.cell !== 'object') { throw new Error('cell should be provided'); }
    if (typeof options.board !== 'object') { throw new Error('board should be provided'); }

    var cell = options.cell,
        board = options.board,
        fields = cell.editable && cell.editable(),
        el = $(require('./modal.html'));

    if (!fields) { return; }

    board.startUndoSequence();

    $(document.body).append(el);

    function tearDown() {
        el.remove();
        board.stopUndoSequence();
    }

    ko.applyBindings(new ElementViewModel({cell: cell, fields: fields}, function () { el.modal('hide'); }), el.find('.modal-content')[0]);

    el.modal('show').on('hidden.bs.modal', tearDown);
}

exports.ModalEdit = ModalEdit;
