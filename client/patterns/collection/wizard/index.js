function PatternViewModel(options) {
  options = options || {};
  console.log("PatternViewModel!");

  self.load = function () {
    console.log("Load");
  }
}

function CreatePattern(options) {
    if(!(this instanceof CreatePattern)){
        return new CreatePattern(options);
    }
    options = options || {};

    return new PatternViewModel();
}

exports.createPattern = CreatePattern;
