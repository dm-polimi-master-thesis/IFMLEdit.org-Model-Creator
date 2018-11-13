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
  self.name = ko.observable("Sign Up and Log In");
  self.signUpFormName = ko.observable("Sign Up Form");
  self.logInFormName = ko.observable("Log In Form");
  self.signUpFieldToAdd = ko.observable("");
  self.logInFieldToAdd = ko.observable("");
  self.signUpFields = ko.observableArray(["name","surname","username","password"]);
  self.logInFields = ko.observableArray(["username","password"]);

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if(type === 'sign-up'){
      fieldToAdd = self.signUpFieldToAdd;
      fields = self.signUpFields;
    } else {
      fieldToAdd = self.logInFieldToAdd;
      fields = self.logInFields;
    }
    if(!(fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var duplicate = false;

      _.forEach(fields(), function(field) {
         if(field.toLowerCase() === fieldToAdd().toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });
      if(!duplicate){
        fields.push(fieldToAdd());
        fieldToAdd("");
      }
    }
  }

  self.deleteField = function(type){
    if (type === 'sign-up') {
      self.signUpFields.remove(this);
    } else {
      self.logInFields.remove(this);
    }
  }

  self.select = function () {
    self.selected().fields = _.map(self.fields.removeAll(), 'name');
    self.selected(this);
    self.fields(_.map(this.fields, function(field) { return { name : field }; }));

    if(!(self.selected().formName.length > 0)){
      $('#form-name-form').addClass('has-error');
    } else {
      $('#form-name-form').removeClass('has-error');
    }
  }

  self.transform = function () {
    var error = false;

    if(!(self.name().length > 0)) {
      error = true;
      $('#pattern-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: the pattern cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.signUpFormName().length > 0)) {
      error = true;
      $('#sign-up-name-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: sign up form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.logInFormName().length > 0)) {
      error = true;
      $('#log-in-name-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: log in form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if(error){
      return undefined;
    }

    var signUpLogIn = {
      name : self.name(),
      signUp : { formName: self.signUpFormName(), fields: self.signUpFields() },
      logIn : { formName: self.logInFormName(), fields: self.logInFields() }
    }

    return parser(signUpLogIn);
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
    ko.applyBindings(pattern, $('#sign-up-log-in-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
