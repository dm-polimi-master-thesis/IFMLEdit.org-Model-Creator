// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    parser = require('./parser.js').parser;


function SettingsPatternViewModel(options) {

  var self = this;

  self.id = options.id;
  self.name = ko.observable("Wizard Pattern");
  self.stepToAdd = ko.observable("");
  self.fieldToAdd = ko.observable("");
  self.steps = ko.observableArray([{ name: "Step 1", formName: "Step 1 Form", fields: [] }, { name: "Step 2", formName: "Step 2 Form", fields: [] }]);
  self.fields = ko.observableArray([]);
  self.selected = ko.observable(self.steps()[0]);

  self.addStep = function () {
    if(!(self.stepToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as step name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.stepToAdd();
      var formName = name + " Form";
      var duplicate = false;

      ko.utils.arrayForEach(self.steps(), function(step) {
         if(step.name.toLowerCase() === name.toLowerCase()){
           $.notify({message: 'Duplicate step name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate){
        self.steps.push({ name: name, formName: formName, fields: [] });
        self.selected().fields = _.map(self.fields.removeAll(), 'name');
        self.selected(self.steps()[self.steps().length - 1]);
        self.stepToAdd("");
      }
    }
  }

  self.addField = function () {
    if(!(self.fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.fieldToAdd();
      var duplicate = false;

      ko.utils.arrayForEach(self.fields(), function(field) {
         if(field.name.toLowerCase() === name.toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate){
        self.fields.push({ name: name });
        self.fieldToAdd("");
      }
    }
  }

  self.deleteStep = function () {
    self.steps.remove(this);
    if (self.steps().length > 0 && self.selected() === this) {
      self.fields.removeAll();
      self.selected(self.steps()[0]);
      self.fields(_.map(self.steps()[0].fields, function(field) { return { name : field }; }));
    } else if (self.steps().length === 0) {
      self.fields.removeAll();
      self.selected({name: "", formName: "", fields: []});
    }
  }

  self.deleteField = function () {
    self.fields.remove(this);
  }

  self.select = function () {
    self.selected().fields = _.map(self.fields.removeAll(), 'name');
    self.selected(this);
    self.fields(_.map(this.fields, function(field) { return { name : field }; }));
  }

  self.transform = function () {
    if(self.steps().length < 2){
      $.notify({message: 'Your request cannot be processed. The wizard pattern require a minimum of two steps.'},
        {allow_dismiss: true, type: 'danger'});
      return undefined;
    }
    self.selected().fields = _.map(self.fields.removeAll(), 'name');
    var wizard = {
      name : self.name(),
      steps : self.steps()
    }
    return parser(wizard);
  }
}

function SettingsPattern(options) {
    if(!(this instanceof SettingsPattern)){
        return new SettingsPattern(options);
    }
    options = options || {};

    var pattern = new SettingsPatternViewModel(options);
    ko.applyBindings(pattern, $('#wizard-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
