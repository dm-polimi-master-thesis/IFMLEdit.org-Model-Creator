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
    self.modalType = ko.observable('create');

    self.load = function () {
      var result = self.pattern.transform();

      if(result !== undefined){
        options.load(result);
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

function ModalPatternMatchingViewModal(options,close) {
    var self = this;

    if (typeof options.cell !== 'object') { throw new Error('cell should be provided'); }
    if (typeof options.board !== 'object') { throw new Error('board should be provided'); }

    var cell = options.cell,
        board = options.board,
        fields = cell.pattern && cell.pattern(),
        el = $(require('./modal.html'));

    self.pattern = options.setPattern( { id: options.pattern } );

    self.close = close;
    self.modalType = ko.observable('update');

    self.update = function () {
      /*var result = self.pattern.transform();

      if(result !== undefined){
        options.load(result);
        self.close();
      }*/
    }
}

function ModalPatterns(options) {
    if(!(this instanceof ModalPatterns)){
        return new ModalPatterns(options);
    }
    options = options || {};

    if (options.type === undefined) { throw new Error('missing type option');}

    var el = $(require('./modal.html'));

    $(document.body).append(el);

    function tearDown(){
        el.remove();
    }

    if (options.type === 'create') {
        if (options.patterns === undefined) { throw new Error('missing pattern option'); }
        if (!_.isArray(options.patterns)) { throw new Error('patterns should be an array'); }
        if (typeof options.load !== 'function') { throw new Error('missing load option'); }

        var patterns = options.patterns,
            load = options.load,
            createHome = require('../../patterns/home/index.js').HomePatterns;

        ko.applyBindings(new ModalPatternsViewModel({ patterns: patterns, load: load, createHome: createHome }, function () { el.modal('hide'); }), el.find('#pattern-modal')[0]);
        el.modal('show').on('hidden.bs.modal', tearDown);
    } else if (options.type === 'load') {
        if (options.pattern === undefined) { throw new Error('missing match option');}

        var pattern = options.cell.attributes.pattern[0].value.replace(/\s+/g),
            update = require('../../patterns/collection' + pattern + '/update.js').update,
            load = require('../../patterns/collection' + pattern + '/load.js').load,
            setPattern = require('../../patterns/collection' + pattern + '/index.js').SettingsPattern;

        var fields = update(options.cell);

        ko.applyBindings(new ModalPatternMatchingViewModal({ id: pattern, setPattern: setPattern, fileds: fields, load: load }, function () { el.modal('hide'); }), el.find('#pattern-modal')[0]);
        el.modal('show').on('hidden.bs.modal', tearDown);
    }
}

exports.ModalPatterns = ModalPatterns;
