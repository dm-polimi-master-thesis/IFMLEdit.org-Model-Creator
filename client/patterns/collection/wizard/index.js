function SettingsPatternViewModel(options) {
  console.log("PatternViewModel!");

  var self = this;

  var boss = "FLG{youareaboss}";
  var loser = "FLG{youarealoser}";
  var count = true;

  self.flag = ko.observable(boss);
  self.id = options.id;

  self.trafficLight = function () {
    console.log("Traffic Light");
    setInterval(function(){
      if(count){
        self.flag(loser);
      } else {
        self.flag(boss);
      }
      count = !count;
    }, 1000);
  }

  self.load = function () {
    console.log("Load");
  }
}

function SettingsPattern(options) {
    if(!(this instanceof SettingsPattern)){
        return new SettingsPattern(options);
    }
    options = options || {};

    var pattern = new SettingsPatternViewModel(options);

    ko.applyBindings(pattern, $('#pattern-settings')[0]);

    return pattern;
}

exports.SettingsPattern = SettingsPattern;
