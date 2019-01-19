// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    create = require('./create.js').create,
    load = require('./load.js').load;


function SettingsPatternViewModel(options) {
  var self = this,
      fields = options.fields || undefined,
      cell = options.cell || undefined;

  self.id = options.id;
  self.type = fields ? fields.type : 'create';
  self.name = ko.observable(fields ? fields.name : "In-Place Log In");
  self.editorOption = ko.observable(fields ? fields.editorOption : true);
  self.editorFormName = ko.observable(fields ? fields.editorFormName : "Editor Form");
  self.logInFormName = ko.observable(fields ? fields.logInFormName : "Log In Form");
  self.editorFieldToAdd = ko.observable("");
  self.logInFieldToAdd = ko.observable("");
  self.editorFields = ko.observableArray(fields ? fields.editorFields : []);
  self.logInFields = ko.observableArray(fields ? fields.logInFields : [{ label: "username", value: "username", type: ko.observable('text'), name: ko.observable('') },{ label: "password", value: "password", type: ko.observable('password'), name: ko.observable('') }]);
  self.types = ['text','textarea','password','checkbox','radio','reset','hidden','hidden-object'];

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if(type === 'editor'){
      fieldToAdd = self.editorFieldToAdd;
      fields = self.editorFields;
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
         if(field.value.toLowerCase() === fieldToAdd().toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });
      if(!duplicate){
        fields.push({ label: fieldToAdd(), value: fieldToAdd(), type: ko.observable('text'), name: ko.observable('') });
        fieldToAdd("");
      }
    }
  }

  self.deleteField = function(type){
    if (type === 'editor') {
      self.editorFields.remove(this);
    } else {
      self.logInFields.remove(this);
    }
  }

  self.changeName = function(id) {
    if(this.type() == 'checkbox' || this.type() == 'radio') {
      $('#' + id).show();
    } else {
      $('#' + id).hide();
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
    if (!(self.editorFormName().length > 0) && self.editorOption()) {
      error = true;
      $('#editor-name-form').addClass('has-error');
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

    var editorFields = _.map(self.editorFields(), function (field) {
        return {
          label: field.label,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
    });

    var logInFields = _.map(self.logInFields(), function (field) {
        return {
          label: field.label,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
    });

    var inPlaceLogIn = {
      name: self.name(),
      editor: { formName: self.editorFormName(), fields: editorFields },
      logIn: { formName: self.logInFormName(), fields: logInFields },
      editorOption: self.editorOption()
    }

    if(self.type === 'create'){
        return create(inPlaceLogIn);
    } else {
        return load(inPlaceLogIn,cell);
    }
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
    ko.applyBindings(pattern, $('#in-place-log-in-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
