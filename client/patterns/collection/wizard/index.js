// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function SettingsPatternViewModel(options) {

  var self = this;

  self.id = options.id;
  self.name = ko.observable("Wizard Pattern");
  self.stepToAdd = ko.observable("");
  self.fieldToAdd = ko.observable("");
  self.steps = ko.observableArray([{ name: "Step 1", form: "Step 1 Form", fields: [] }, { name: "Step 2", form: "Step 2 Form", fields: [] }]);
  self.fields = ko.observableArray([]);
  self.selected = ko.observable(self.steps()[0]);

  self.addStep = function () {
    console.log("Add Step");
    if(!(self.stepToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as step name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.stepToAdd();
      var form = name + "Form";
      var duplicate = false;

      ko.utils.arrayForEach(self.steps(), function(step) {
         if(step.name === name){
           $.notify({message: 'Duplicate step name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate){
        self.steps.push({ name: name, form: form, fields: [] });
        self.stepToAdd("");
      }
    }
  }

  self.addField = function () {
    console.log("Add Field");
    if(!(self.fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.fieldToAdd();
      var duplicate = false;

      ko.utils.arrayForEach(self.fields(), function(field) {
         if(field.name === name){
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
    console.log("Delete Step");
    self.steps.remove(this);
    self.fields.removeAll();
  }

  self.deleteField = function () {
    console.log("Delete Field");
    self.fields.remove(this);
  }

  self.addPatternName = function () {
    console.log("Add Pattern Name");
  }

  self.select = function () {
    self.selected().fields = _.map(self.fields.removeAll(), 'name');
    console.log('old',self.selected());
    self.selected(this);
    self.fields(_.map(this.fields, function(field) { return { name : field }; }));
    console.log('new',self.selected());
  }

  self.transform = function () {
    self.selected().fields = _.map(self.fields.removeAll(), 'name');

    var wizard = {};
    wizard.name = self.name();
    wizard.steps = self.steps();

    console.log('wizard', wizard);

    return wizard;
  }

  self.toJSON = function () {

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
