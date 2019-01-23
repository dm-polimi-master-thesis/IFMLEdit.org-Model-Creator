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
  self.name = ko.observable(fields ? fields.name : "Restricted Search");
  self.searchField = ko.observable(fields ? fields.searchField : "");
  self.selectedDetailsName = ko.observable(fields ? fields.selectedDetailsName : "");
  self.collectionName = ko.observable(fields ? fields.collectionName : "");
  self.resultsFieldToAdd = ko.observable("");
  self.selectedFieldToAdd = ko.observable("");
  self.filterName = ko.observable(fields ? fields.filterName : "");
  self.resultsFields = ko.observableArray(fields ? fields.resultsFields : []);
  self.selectedFields = ko.observableArray(fields ? fields.selectedFields : []);

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if(type === 'list'){
      fieldToAdd = self.resultsFieldToAdd;
      fields = self.resultsFields;
    } else {
      fieldToAdd = self.selectedFieldToAdd;
      fields = self.selectedFields;
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
    if (type === 'list') {
      self.resultsFields.remove(this);
    } else {
      self.selectedFields.remove(this);
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
    if (!(self.searchField().length > 0)) {
      error = true;
      $('#search-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: search form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.collectionName().length > 0)) {
      error = true;
      $('#collection-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: collection form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.selectedDetailsName().length > 0)) {
      error = true;
      $('#details-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: details form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.filterName().length > 0)) {
      error = true;
      $('#filter-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: filter form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }

    if(error){
      return undefined;
    }

    var restrictedSearch = {
      name: self.name(),
      search: [{ label: self.searchField(), value: self.searchField(), type:'text', name:'' }],
      filter: self.filterName(),
      list: {
        collection: self.collectionName(),
        fields: _.map(self.resultsFields.removeAll(), function (field) { return { label: field.label, value: field.value, type: field.type(), name: field.name() } })
      },
      details: {
        name: self.selectedDetailsName(),
        fields: _.map(self.selectedFields.removeAll(), function (field) { return { label: field.label, value: field.value, type: field.type(), name: field.name() } })
      }
    }

    if(self.type === 'create'){
        return create(restrictedSearch);
    } else {
        return load(restrictedSearch,cell);
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
    ko.applyBindings(pattern, $('#restricted-search-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
