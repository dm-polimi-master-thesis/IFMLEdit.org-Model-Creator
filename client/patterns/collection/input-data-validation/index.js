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
  self.name = ko.observable("Input Data Validation");
  self.dataFormName = ko.observable("Data Form");
  self.fieldToAdd = ko.observable("");
  self.fields = ko.observableArray();
  self.types = ['text','password','checkbox','radio','reset'];

  self.addField = function () {
    if(!(self.fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var duplicate = false;
      _.forEach(self.fields(), function(field) {
         if(field.value.toLowerCase() === self.fieldToAdd().toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });
      if(!duplicate){
        self.fields.push({ label: self.fieldToAdd(), value: self.fieldToAdd(), type: ko.observable('text'), name: ko.observable('') });
        self.fieldToAdd("");
      }
    }
  }

  self.changeName = function(id) {
    if(this.type() == 'checkbox' || this.type() == 'radio') {
      $('#' + id).show();
    } else {
      $('#' + id).hide();
    }
  }

  self.deleteField = function () {
    self.fields.remove(this);
  }

  self.transform = function () {
    var error = false;

    if(!(self.name().length > 0)) {
      error = true;
      $('#pattern-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: the pattern cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.dataFormName().length > 0)) {
      error = true;
      $('#data-form-name').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: data form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if(error){
      return undefined;
    }

    var fields = _.map(self.fields(), function (field) {
        return {
          label: field.label,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
    });

    var inputDataValidation = {
      name : self.name(),
      data : { formName: self.dataFormName(), fields: fields }
    }

    return parser(inputDataValidation);
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
    ko.applyBindings(pattern, $('#input-data-validation-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
