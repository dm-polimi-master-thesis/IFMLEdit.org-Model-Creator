// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function ModalAssistantViewModel(options,close) {
    var self = this;

    self.close = close;
    self.message = ko.observable('Welcome in IFML Model Creator');
    self.description = ko.observable('How can I help you?');

    /*self.guided = function () {
      var result = self.pattern.transform();

      if(result !== undefined){
        self.close();
      }
    }*/

    /*self.nextStep = function () {
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
    }*/

    /*self.back = function () {
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
    }*/
}

function ModalAssistant(options) {
    if(!(this instanceof ModalAssistant)){
        return new ModalAssistant(options);
    }
    options = options || {};

    var self = this,
        el = $(require('./modal.html'));

    $(document.body).append(el);

    function tearDown(){
        el.remove();
    }

    var home = new ModalAssistantViewModel( {} , function () { el.modal('hide'); });

    ko.applyBindings(home, el.find('#assistant-modal')[0]);
    el.modal('show').on('hidden.bs.modal', tearDown);

    return home;
}

exports.ModalAssistant = ModalAssistant;
