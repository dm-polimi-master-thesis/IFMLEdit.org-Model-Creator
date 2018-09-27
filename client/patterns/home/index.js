function HomePatternsViewModel(options) {
    var self = this;
    self.categories = options.categories;
    self.patterns = ko.observableArray(options.patterns);
    self.selected = ko.observable(self.patterns()[0].list[0]);
    self.category = ko.observableArray();

    self.search = function () {
      var input, filter, list, li, span;
      input = $(".search")[0];
      filter = input.value.toUpperCase();
      list = $(".list-pattern");
      li = list.find("li");
      for (var i = 0; i < li.length; i++) {
        span = $(li[i]).find("span")[0];
        if (span.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }

    self.select = function () {
      self.selected(this);
    }
}

function HomePatterns(options) {
    if(!(this instanceof HomePatterns)){
        return new HomePatterns(options);
    }
    options = options || {};

    if(options.patterns === undefined) { throw new Error('missing pattern options'); }
    if(!_.isArray(options.patterns)) { throw new Error('patterns should be an array'); }

    var patterns = options.patterns,
        el = $(require('./home.html')),
        categories = ['All'];

        $.each(options.patterns, function (index, obj){
          categories.push(obj.category);
        });

    $('#pattern-home').append(el);

    var homePatternsVm = new HomePatternsViewModel({ patterns:patterns, categories:categories });

    ko.applyBindings(homePatternsVm, $('#pattern-home')[0]);

    return homePatternsVm;
}

exports.HomePatterns = HomePatterns;
