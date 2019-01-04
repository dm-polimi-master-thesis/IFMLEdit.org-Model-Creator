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
  self.name = ko.observable("Wizard");
  self.stepToAdd = ko.observable("");
  self.fieldToAdd = ko.observable("");
  self.steps = ko.observableArray([{ name: "Step 1", formName: "Step 1 Form", fields: [] }, { name: "Step 2", formName: "Step 2 Form", fields: [] }]);
  self.fields = ko.observableArray([]);
  self.selected = ko.observable(self.steps()[0]);
  self.types = ['text','textarea','password','checkbox','radio','reset','hidden','hidden-object'];

  self.addStep = function () {
    if(!(self.stepToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as step name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.stepToAdd();
      var formName = name + " Form";
      var duplicate = false;

      _.forEach(self.steps(), function(step) {
         if(step.name.toLowerCase() === name.toLowerCase()){
           $.notify({message: 'Duplicate step name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate) {
        self.steps.push({ name: name, formName: formName, fields: [] });
        self.selected().fields = self.fields.removeAll();
        self.selected(self.steps()[self.steps().length - 1]);
        self.stepToAdd("");
        if(self.steps().length === 1){
          $('#input-field').prop('disabled',false);
          $('#form-name-form').prop('disabled',false);
        }
      }
    }
  }

  self.addField = function () {
    if(!(self.fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var value = self.fieldToAdd();
      var duplicate = false;

      _.forEach(self.fields(), function(field) {
         if(field.value.toLowerCase() === value.toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate) {
        self.fields.push({ label: value, value: value , type: ko.observable('text'), name: ko.observable('') });
        self.fieldToAdd("");
      }
    }
  }

  self.deleteStep = function () {
    self.steps.remove(this);
    if (self.steps().length > 0 && self.selected() === this) {
      self.fields.removeAll();
      self.selected(self.steps()[0]);
      self.fields(self.steps()[0].fields);
    } else if (self.steps().length === 0) {
      self.selected({name: "", formName: "", fields: [] });
      self.fields.removeAll();
      $('#input-field').prop('disabled',true);
      $('#form-name-form').prop('disabled',true);
    }
  }

  self.deleteField = function () {
    self.fields.remove(this);
  }

  self.select = function () {
    self.selected().fields = self.fields.removeAll();
    self.selected(this);
    self.fields(this.fields);

    if(!(self.selected().formName.length > 0)){
      $('#form-name-form').addClass('has-error');
    } else {
      $('#form-name-form').removeClass('has-error');
    }

    _.forEach(self.fields(), function (field, index) {
      if(field.type() == 'checkbox' || field.type() == 'radio') {
        $('#name-' + index).show();
      } else {
        $('#name-' + index).hide();
      }
    });
  }

  self.changeName = function(id) {
    if(this.type() == 'checkbox' || this.type() == 'radio') {
      $('#' + id).show();
    } else {
      $('#' + id).hide();
    }
  }

  self.transform = function () {
    self.selected().fields = self.fields.removeAll();
    var error = false;

    if (self.steps().length < 2) {
      error = true;
      $.notify({message: 'Your request cannot be processed: wizard pattern require a minimum of two steps.'},
        {allow_dismiss: true, type: 'danger'});
      return undefined;
    }
    if (!(self.name().length > 0)) {
      error = true;
      $('#pattern-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: the pattern cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    _.forEach(self.steps(), function(step) {
      if (!(step.formName.length > 0)) {
        error = true;
        self.selected(step);
        $('#form-name-form').addClass('has-error');
        $.notify({message: 'Your request cannot be processed: ' + step.name + ' cannot have an empty form name.'},
          {allow_dismiss: true, type: 'danger'});
        return false;
      }
    });
    if (error) {
      return undefined;
    }

    _.forEach(self.steps(), function (step) {
      step.fields = _.map(step.fields, function (field) {
        return {
          label: field.label,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
      });
    });

    var wizard = {
      name : self.name(),
      steps : self.steps()
    }

    return parser(wizard);
  }

  self.validate = function (str,id) {
    if(str.length > 0) {
      $(id).removeClass('has-error');
    } else {
      $(id).addClass('has-error');
    }
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
