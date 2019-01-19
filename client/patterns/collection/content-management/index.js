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
  self.name = ko.observable(fields ? fields.name : "Content Management");
  self.dataOption = ko.observable(fields ? fields.dataOption : true);
  self.detailsOption = ko.observable(fields ? fields.detailsOption : true);
  self.pageListOption = ko.observable(fields ? fields.pageListOption : true);
  self.selectedDetailsName = ko.observable(fields ? fields.selectedDetailsName : "");
  self.dataEntryFormName = ko.observable(fields ? fields.dataEntryFormName : "");
  self.collectionListName = ko.observable(fields ? fields.collectionListName : "");
  self.collectionDetailsName = ko.observable(fields ? fields.collectionDetailsName : "");
  self.resultsFieldToAdd = ko.observable("");
  self.dataEntryFieldToAdd = ko.observable("");
  self.resultsFields = ko.observableArray(fields ? _.map(fields.resultsFields, function (f) {return {label: f.label, value: f.value, type: ko.observable(f.type), name: ko.observable(f.name)}}) : []);
  self.dataEntryFields = ko.observableArray(fields ? _.map(fields.dataEntryFields, function (f) {return {label: f.label, value: f.value, type: ko.observable(f.type), name: ko.observable(f.name)}}) : []);
  self.types = ['text','textarea','password','checkbox','radio','reset','hidden','hidden-object'];

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if (type === 'list') {
      fieldToAdd = self.resultsFieldToAdd;
      fields = self.resultsFields;
    } else {
      fieldToAdd = self.dataEntryFieldToAdd;
      fields = self.dataEntryFields;
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
        if(type !== 'data-entry'){
          fields.push({ label: fieldToAdd(), value: fieldToAdd(), type: 'text', name: '' });
        } else {
          fields.push({ label: fieldToAdd(), value: fieldToAdd(), type: ko.observable('text'), name: ko.observable('') });
        }
        fieldToAdd("");
      }
    }
  }

  self.deleteField = function(type){
    if (type === 'list') {
      self.resultsFields.remove(this);
    } else {
      self.dataEntryFields.remove(this);
    }
  }

  self.changeName = function(id) {
    if(this.type() == 'checkbox' || this.type() == 'radio') {
      $('#' + id).show();
    } else {
      $('#' + id).hide();
    }
  }

  self.visible = function(id) {
      console.log(id);
      console.log(this);
      console.log(this.type());
      console.log(this.name());
      if(this.type() === 'checkbox' || this.type() === 'radio') {
          $('#' + id).show();
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
    if (!(self.collectionListName().length > 0) && self.pageListOption()) {
      error = true;
      $('#collection-list-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: list collection form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.collectionDetailsName().length > 0) && self.detailsOption()) {
      error = true;
      $('#collection-details-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: details collection form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.selectedDetailsName().length > 0) && self.detailsOption()) {
      error = true;
      $('#details-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: details form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.dataEntryFormName().length > 0) && self.dataOption()) {
      error = true;
      $('#data-entry-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: dataEntry form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }

    if(error){
      return undefined;
    }

    var dataEntry = _.map(self.dataEntryFields(), function (field) {
        return {
          label: field.value,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
    });

    var pageManagement = {
      name: self.name(),
      list: {
        collection: self.collectionListName(),
        fields: self.resultsFields.removeAll()
      },
      details: {
        name: self.selectedDetailsName(),
        collection: self.collectionDetailsName(),
        fields: dataEntry
      },
      dataEntry: {
        name: self.dataEntryFormName(),
        fields: dataEntry
      },
      pageListOption: self.pageListOption(),
      detailsOption: self.detailsOption(),
      dataOption: self.dataOption()
    }

    if(self.type === 'create'){
        return create(pageManagement);
    } else {
        return load(pageManagement,cell);
    }
  }

  self.validate = function (str,id) {
    if(str.length > 0) {
      $(id).removeClass('has-error');
    } else {
      $(id).addClass('has-error');
    }
  }

  self.checkbox = function () {
    if (!self.pageListOption()) {
        self.dataOption(true);
        self.detailsOption(true);
        $('#dataOption').prop('disabled',true);
        $('#detailsOption').prop('disabled',true);
    } else if (!self.dataOption()) {
        self.pageListOption(true);
        self.detailsOption(true);
        $('#pageListOption').prop('disabled',true);
        $('#detailsOption').prop('disabled',true);
    } else if (!self.detailsOption()){
        self.pageListOption(true);
        self.dataOption(true);
        $('#pageListOption').prop('disabled',true);
        $('#dataOption').prop('disabled',true);
    } else if (self.pageListOption() && self.dataOption() && self.detailsOption()) {
        $('#dataOption').prop('disabled',false);
        $('#detailsOption').prop('disabled', false);
        $('#pageListOption').prop('disabled', false);
    }
  }

  if (self.type === 'update') {
      $('#dataOption').prop('disabled',true);
      $('#detailsOption').prop('disabled', true);
      $('#pageListOption').prop('disabled', true);
      if (!self.dataOption()){
          $('#data-entry-form').prop('disable',true);
      } else if (!self.pageListOption()) {
          $('#collection-list-form').prop('disable',true);
          $('#field-page-list').prop('disable',true);
      } else if (!self.detailsOption()) {
          $('#details-form').prop('disable',true);
          $('#collection-details-form').prop('disable',true);
      }
  }
}

function SettingsPattern(options) {
    if(!(this instanceof SettingsPattern)){
        return new SettingsPattern(options);
    }
    options = options || {};

    var pattern = new SettingsPatternViewModel(options);
    ko.applyBindings(pattern, $('#content-management-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
