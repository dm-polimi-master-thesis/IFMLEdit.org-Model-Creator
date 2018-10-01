function SettingsPatternViewModel(options) {

  var self = this;

  self.id = options.id;
  self.name = ko.observable();
  self.stepToAdd = ko.observable("");
  self.fieldToAdd = ko.observable("");
  self.steps = ko.observableArray([{ name: "Step 1", form: "Step 1 Form", fields: [] }, { name: "Step 2", form: "Step 2 Form", fields: [] }]);
  self.fields = ko.observableArray([]);
  self.selected = ko.observable(self.steps()[0]);

  self.addStep = function () {
    console.log("Add Step");
    if(!(self.stepToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as step name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {

      var name = self.stepToAdd();
      var form = name + "Form";

      ko.utils.arrayForEach(self.steps(), function(step) {
         if(step.name === name){
           $.notify({message: 'Duplicate step name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           return;
         }
      })();

      self.steps.push({ name: name, form: form, fields: [] });
      self.stepToAdd("");
    }
  }

  self.addField = function () {
    console.log("Add Field");
    if(!(self.fieldToAdd().length > 0)){
      $.notify({message: 'Void string is not accepted as field name.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      
      ko.utils.arrayForEach(self.fields(), function(step) {
         if(field.name === name){
           $.notify({message: 'Duplicate field name is not accepted.'},
             {allow_dismiss: true, type: 'danger'});
           return;
         }
      })();
      var name = self.fieldToAdd();
      self.fields.push({ name: name });
      self.fieldToAdd("");
    }
  }

  self.deleteStep = function () {
    console.log("Delete Step");
    self.steps.remove(this);
  }

  self.deleteField = function () {
    console.log("Delete Field");
    self.fields.remove(this);
  }

  self.addPatternName = function () {
    console.log("Add Pattern Name");
  }

  self.select = function () {
    self.selected(this);
  }

  self.load = function () {
    if(self.steps().length < 2){
      $.notify({message: 'Your request cannot be processed. The wizard pattern require a minimum of two steps.'},
        {allow_dismiss: true, type: 'danger'});
    } else {
      // TODO: process the request
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
