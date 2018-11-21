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
  self.name = ko.observable("Faceted Search");
  self.searchField = ko.observable("");
  self.selectedDetailsName = ko.observable("");
  self.filtersFormName = ko.observable("");
  self.collectionName = ko.observable("");
  self.resultsFieldToAdd = ko.observable("");
  self.selectedFieldToAdd = ko.observable("");
  self.filtersFieldToAdd = ko.observable("");
  self.resultsFields = ko.observableArray([]);
  self.selectedFields = ko.observableArray([]);
  self.filtersFields = ko.observableArray([]);
  self.types = ['checkbox','radio'];

  self.addField = function (type) {
    var fieldToAdd;
    var fields;

    if (type === 'list') {
      fieldToAdd = self.resultsFieldToAdd;
      fields = self.resultsFields;
    } else if (type === 'details') {
      fieldToAdd = self.selectedFieldToAdd;
      fields = self.selectedFields;
    } else {
      fieldToAdd = self.filtersFieldToAdd;
      fields = self.filtersFields;
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
        if(type !== 'filters'){
          fields.push({ label: fieldToAdd(), value: fieldToAdd(), type: 'text', name: '' });
        } else {
          fields.push({ label: fieldToAdd(), value: fieldToAdd(), type: ko.observable('checkbox'), name: ko.observable('') });
        }
        fieldToAdd("");
      }
    }
  }

  self.deleteField = function(type){
    if (type === 'list') {
      self.resultsFields.remove(this);
    } else if (type === 'details') {
      self.selectedFields.remove(this);
    } else {
      self.filtersFields.remove(this);
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
    if (!(self.filtersFormName().length > 0)) {
      error = true;
      $('#filters-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: filters form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }

    if(error){
      return undefined;
    }

    var filters = _.map(self.filtersFields(), function (field) {
        return {
          label: field.value,
          value: field.value,
          type: field.type(),
          name: field.name()
        }
    });

    var facetedSearch = {
      name: self.name(),
      search: [{ label: self.searchField(), value: self.searchField(), type: 'text', name: '' }],
      list: {
        collection: self.collectionName(),
        fields: self.resultsFields.removeAll()
      },
      details: {
        name: self.selectedDetailsName(),
        fields: self.selectedFields.removeAll()
      },
      filters: {
        name: self.filtersFormName(),
        fields: filters
      }
    }
    return parser(facetedSearch);
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
    ko.applyBindings(pattern, $('#faceted-search-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
