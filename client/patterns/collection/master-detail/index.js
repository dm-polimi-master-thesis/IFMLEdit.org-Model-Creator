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
  self.name = ko.observable("Master Detail");
  self.detailsName = ko.observable("");
  self.collectionName = ko.observable("");
  self.listFieldToAdd = ko.observable("");
  self.detailsFieldToAdd = ko.observable("");
  self.listFields = ko.observableArray([]);
  self.detailsFields = ko.observableArray([]);
  self.xorOption = ko.observable(true);

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
      self.listFields.remove(this);
    } else {
      self.detailsFields.remove(this);
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
    if (!(self.collectionName().length > 0)) {
      error = true;
      $('#collection-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: collection form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }
    if (!(self.detailsName().length > 0)) {
      error = true;
      $('#details-form').addClass('has-error');
      $.notify({message: 'Your request cannot be processed: details form cannot have an empty name.'},
        {allow_dismiss: true, type: 'danger'});
    }

    if(error){
      return undefined;
    }

    var masterDetail = {
      name: self.name(),
      list: {
        collection: self.collectionName(),
        fields: self.listFields.removeAll()
      },
      details: {
        name: self.detailsName(),
        fields: self.detailsFields.removeAll()
      },
      xor: self.xorOption()
    }

    return parser(masterDetail);
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
    ko.applyBindings(pattern, $('#master-detail-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
