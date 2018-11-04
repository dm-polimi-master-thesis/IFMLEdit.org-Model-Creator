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
  self.name = ko.observable("Multilevel Master Detail");
  self.detailsName = ko.observable("");
  self.steps = ko.observableArray([{ name: "Step 1", collection: "", fields: [] }, { name: "Step 2", collection: "", fields: [] }]);
  self.stepToAdd = ko.observable("");
  self.listFieldToAdd = ko.observable("");
  self.detailsFieldToAdd = ko.observable("");
  self.listFields = ko.observableArray([]);
  self.detailsFields = ko.observableArray([]);
  self.selected = ko.observable(self.steps()[0]);

  self.select = function () {
    self.selected().fields = self.listFields.removeAll();
    self.selected(this);
    self.listFields(self.selected().fields);
  }

  self.addStep = function () {
    if(!(self.stepToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as step name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.stepToAdd();
      var duplicate = false;
      _.forEach(self.steps(), function(step) {
         if(step.name.toLowerCase() === name.toLowerCase()){
           $.notify({message: 'Duplicate step name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });
      if(!duplicate){
        self.steps.push({ name: name, collection: "", fields: [] });
        self.selected().fields = self.listFields.removeAll();
        self.selected(self.steps()[self.steps().length - 1]);
        self.stepToAdd("");
        $('#list-input').prop('disabled',false);
        $('#collection-input').prop('disabled',false);
      }
    }
  }

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if(type === 'list'){
      fieldToAdd = self.listFieldToAdd;
      fields = self.listFields;
    } else {
      fieldToAdd = self.detailsFieldToAdd;
      fields = self.detailsFields;
    }
    if(!(fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var duplicate = false;

      _.forEach(fields(), function(field) {
         if(field.name.toLowerCase() === fieldToAdd().toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });
      if(!duplicate){
        if(type === 'list'){
          fields.push({ name: fieldToAdd(), filter: true });
        } else {
          fields.push({ name: fieldToAdd() });
        }
        fieldToAdd("");
      }
    }
  }

  self.deleteStep = function () {
    self.steps.remove(this);
    if (self.steps().length > 0 && self.selected() === this) {
      self.listFields.removeAll();
      self.selected(self.steps()[0]);
      self.listFields(self.steps()[0].fields);
      if(self.steps.indexOf(this) === (self.steps().lenght - 1)){
        $('#list-input').prop('disabled',true);
        $('#collection-input').prop('disabled',true);
      } else {
        $('#list-input').prop('disabled',false);
        $('#collection-input').prop('disabled',false);
      };
    } else if (self.steps().length === 0) {
      self.selected({ name: "", collection: "", fields: [] } );
      self.listFields.removeAll();
      $('#list-input').prop('disabled',true);
      $('#collection-input').prop('disabled',true);
    }
  }

  self.deleteField = function(type){
    if (type === 'list') {
      self.listFields.remove(this);
    } else {
      self.detailsFields.remove(this);
    }
  }

  self.transform = function () {
    var error = false;

    if(self.steps().length < 2){
      error = true;
      $.notify({message: 'Your request cannot be processed: wizard pattern require a minimum of two steps.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if(!(self.name().length > 0)) {
      error = true;
      $('#pattern-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: the pattern cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.detailsName().length > 0)) {
      error = true;
      $('#details-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: details form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    _.forEach(self.steps(), function(step) {
      if(!(step.collection.length > 0)){
        error = true;
        self.selected(step);
        $('#collection-form').addClass('has-error');
        $.notify({message: 'Your request cannot be processed: ' + step.name + ' cannot have an empty form name.'},
          {allow_dismiss: true, type: 'danger'});
        return false;
      }
    });

    if(error){
      return undefined;
    }

    _.forEach(self.steps(), function (step) {
      step.filters = _.filter(step.fields, function (field) { return field.filter === true;})
                      .map(function (filter) {
                        return filter.name;
                      })
      step.fields = _.map(step.fields, 'name');
    });

    var multilevelMasterDetail = {
      name: self.name(),
      steps: self.steps(),
      details: {
        name: self.detailsName(),
        collection: self.steps()[self.steps().length - 1].collection,
        fields: _.map(self.detailsFields.removeAll(), 'name')
      }
    }
    return parser(multilevelMasterDetail);
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
    ko.applyBindings(pattern, $('#multilevel-master-detail-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
