// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

function ModalPatternsViewModel(options, close) {
    var self = this;

    self.home = options.createHome({ patterns: options.patterns });

    self.close = close;
    self.firstStep = ko.observable(true);

    self.load = function () {
      if(self.pattern.steps().length < 2){
        $.notify({message: 'Your request cannot be processed. The wizard pattern require a minimum of two steps.'},
          {allow_dismiss: true, type: 'danger'});
      } else {

        var result = self.pattern.transform();

        console.log('result',JSON.stringify(result));

        /*
        var result = pattern.toJSON();
        var start = new Date();

        ifmlModel.addCells(ifml.fromJSON(JSON.parse(result)));
        ifmlBoard.clearHistory();
        $.notify({message: 'File loaded in ' + (Math.floor((new Date() - start) / 10) / 100) + ' seconds!'}, {allow_dismiss: true, type: 'success'});
        loaded_at = new Date();*/

        self.close();
      }
    }

    self.nextStep = function () {
      $('#pattern-home').removeClass()
          .addClass('pattern-home-out')
          .animate({opacity:0,left:'-20px'},1000, function () {
              $(this).hide();

              if(self.pattern === undefined || self.pattern.id !== self.home.selected().id){
                if(!(self.pattern === undefined)){
                  $('#' + self.pattern.id + '-settings-content').remove();
                }
                var el = $(self.home.selected().html);
                $('#pattern-settings').append(el)
                    .addClass('pattern-settings-in')
                    .animate({opacity:1,left:'0px'},800, function () {})
                    .show();

                    self.pattern = self.home.selected().createPattern({ id: self.home.selected().id });
              } else {
                $('#pattern-settings').addClass('pattern-settings-in')
                .animate({opacity:1,left:'0px'},800, function () {})
                .show();
              }
              self.firstStep(false);
          });
    }

    self.back = function () {
      $('#pattern-settings').removeClass()
          .addClass('pattern-settings-out')
          .animate({opacity: 0, left: '20px'},800, function(){
            $(this).hide();
            self.firstStep(true);
            $('#pattern-home').removeClass()
                .addClass("pattern-home-back-in")
                .animate({opacity:1,left:'0px'},800, function () {})
                .show();
          });
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
        createHome = require('../../patterns/home/index.js').HomePatterns;

    $(document.body).append(el);

    function tearDown(){
        el.remove();
    }

    ko.applyBindings(new ModalPatternsViewModel({ patterns: patterns, load: load, createHome: createHome}, function () { el.modal('hide'); }), el.find('#pattern-modal')[0]);

    el.modal('show').on('hidden.bs.modal', tearDown);
}

exports.ModalPatterns = ModalPatterns;
