function SettingsPatternViewModel(options) {

  var self = this;

  self.id = options.id;
  self.steps = ko.observableArray([{ name: "Step 1", form: "Form 1", fileds: [] }, { name: "Step 2", form: "Form 2", fields: [] }]);
  self.selected = ko.observable(self.steps()[0]);

  self.addStep = function () {
    console.log("Add Step");
  }

  self.addField = function () {
    console.log("Add Field");
  }

  self.deleteStep = function () {
    console.log("Delete Step");
  }

  self.deleteField = function () {
    console.log("Delete Field");
  }

  self.addPatternName = function () {
    console.log("Add Pattern Name");
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
