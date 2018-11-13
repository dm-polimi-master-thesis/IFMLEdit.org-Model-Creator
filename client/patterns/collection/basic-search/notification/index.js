function SettingsPatternViewModel(options) {

  var self = this;

  var boss = "FLG{youareinnotification}";
  var count = true;

  self.flag = ko.observable(boss);
  self.id = options.id;
}

function SettingsPattern(options) {
    if(!(this instanceof SettingsPattern)){
        return new SettingsPattern(options);
    }
    options = options || {};

    var pattern = new SettingsPatternViewModel(options);
    ko.applyBindings(pattern, $('#notification-settings-content')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
