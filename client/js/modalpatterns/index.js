// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    ko = require('knockout'),
    document = require('document');

function PatternViewModel(options, close) {
    var self = this;
    self.categories = options.categories;
    self.patterns = ko.observableArray(options.patterns);
    self.selected = ko.observable(self.patterns()[0].list[0]);
    self.config = ko.observable(undefined);
    self.category = ko.observableArray();
    self.close = close;

    self.load = function () {
        options.load();
        //self.close();
    }

    self.search = function () {
      var input, filter, ul, li, span;
      input = document.getElementsByClassName("search")[0];
      filter = input.value.toUpperCase();
      ul = document.getElementsByClassName("pattern-list")[0];
      li = ul.getElementsByTagName("li");
      for (var i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
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

    self.nextStep = function () {
      var el = $(self.selected().html);
      $('#pattern-modal-home').removeClass()
                              .addClass("modal-pattern-home-out")
                              .bind('oanimationend animationend webkitAnimationEnd', function () {
                                $(this).hide();
                                $('.content').append(el)
                                             .addClass('modal-pattern-settings-in');
                                $('.btn-close').replaceWith('<a href="#!" class="btn btn-default btn-back" data-bind="click: back">Back</a>');
                                $('.btn-selection').replaceWith('<a href="#!" class="btn btn-default btn-load" data-bind="click: load">Load</a>');
                              });
      

      self.pattern = ko.observable(self.selected().js.createPattern(), el.find('.modal-content-in-settings')[0]);
    }

    self.back = function () {
      console.log("Back");
      $('#pattern-modal-settings').removeClass()
                                  .addClass("modal-pattern-settings-out")
                                  .bind('oanimationend animationend webkitAnimationEnd', function () {
                                    $(this).hide();
                                  });
      $('#pattern-modal-home').addClass("modal-pattern-home-back-in");

      $('.btn-close').replaceWith('<a href="#!" class="btn btn-default btn-close" data-dismiss="modal">Close</a>');
      $('.btn-selection').replaceWith('<a href="#!" class="btn btn-default btn-selection" data-bind="click: nextStep">Select</a>');

      self.pattern = ko.observable(self.selected().js.createPattern(), el.find('.modal-content-in-settings')[0]);
    }
}

function ModalPatterns(options) {
    if(!(this instanceof ModalPatterns)){
        return new ModalPatterns(options);
    }
    options = options || {};

    if(options.patterns === undefined) { throw new Error('missing pattern options'); }
    if(!_.isArray(options.patterns)) { throw new Error('patterns should be an array'); }
    if(typeof options.load !== 'function') { throw new Error('missing load option'); }

    var patterns = options.patterns,
        load = options.load,
        el = $(require('./modal.html')),
        list = $(require('./list.html')),
        categories = ['All'];

        $.each(options.patterns, function (index, obj){
          categories.push(obj.category);
        });

    $(document.body).append(el);
    $(el.find('.content')[0]).append(list);

    function tearDown(){
        el.remove();
    }

    ko.applyBindings(new PatternViewModel({patterns:patterns, categories:categories, load:load}, function () { el.modal('hide'); }), el.find('.modal-content')[0]);

    el.modal('show').on('hidden.bs.modal', tearDown);
}

exports.ModalPatterns = ModalPatterns;
