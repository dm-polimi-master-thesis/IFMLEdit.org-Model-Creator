// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    parser = require('./parser.js').parser;


function SettingsPatternViewModel(options) {

  var self = this;

  self.name = ko.observable("");
  self.searchField = ko.observable("");
  self.resultsFieldToAdd = ko.observable("");
  self.selectedFieldToAdd = ko.observable("");
  self.resultsFields = ko.observableArray([]);
  self.selectedFields = ko.observableArray([]);

  self.addField = function (type) {
    if(!(self.ieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      var name = self.fieldToAdd();
      var duplicate = false;

      ko.utils.arrayForEach(self.fields(), function(field) {
         if(field.name.toLowerCase() === name.toLowerCase()){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           duplicate = true;
         }
      });

      if(!duplicate){
        if (type === 'list') {
          self.resultsFields.push({ name: name });
          self.resultsFieldToAdd("");
        } else {
          self.selectedFields.push({ name: name });
          self.detailsFieldToAdd("");
        }
      }
    }
  }

  self.deleteStep = function(type){
    if (type === 'list') {
      self.resultsFields.remove(this);
    } else {
      self.selectedFields.remove(this);
    }
  }

  self.transform = function () {
    if(self.steps().length < 2){
      $.notify({message: 'Your request cannot be processed. The wizard pattern require a minimum of two steps.'},
        {allow_dismiss: true, type: 'danger'});
      return undefined;
    }
    self.selected().fields = _.map(self.fields.removeAll(), 'name');
    var wizard = {
      name : self.name(),
      steps : self.steps()
    }
    return parser(wizard);
  }
}

function SettingsPattern(options) {
    if(!(this instanceof SettingsPattern)){
        return new SettingsPattern(options);
    }
    options = options || {};

    var pattern = new SettingsPatternViewModel(options);
    ko.applyBindings(pattern, $('#basic-search-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
