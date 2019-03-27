// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function ModalAssistantViewModel(options) {
    var self = this;

    self.message = ko.observable('Welcome to IFML Model Creator');
    self.description = ko.observable('How can I help you?');
}

function GuidedTourViewModel(options, close) {
    var self = this;

    self.question = ko.observable(options.message),
    self.progressBar = ko.observableArray(options.progressBar),
    self.steps = ko.observableArray([]);

    self.close = close;
    self.next = function (options) {

        var index = parseInt($('.is-active')[0].id.slice(-1));

        $('#message').removeClass('fadeIn');
        $('#message').addClass('fadeOut');
        setTimeout(function () {
            self.question(options.message);
            $('#message').removeClass('fadeOut');
            $('#message').addClass('fadeIn');
        }, 500);

        _.forEach(options.steps, function (step) {
            self.steps.push(step);

            var svg;

            if (step.svg === './svg/okay-animated.svg') {
                svg = require('../../svg/okay-animated.svg');
            } else if (step.svg === './svg/delete-animated.svg') {
                svg = require('../../svg/delete-animated.svg');
            }

            $('#pattern-' + (self.steps().length - 1)).prepend(svg);
        });

        $('.is-active').removeClass('is-active');
        $('#step-' + index).find('.progress-bar__bar').css('transform','translateX(100%)');

        if (!options.end) {
            $('#step-' + (index + 1)).addClass('is-active');
        }

        setTimeout(function () {
            $('#svg-style').remove();
        }, 500);

    }

    return self;
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

    self.close = function () { el.modal('hide') };
    self.content = new ModalAssistantViewModel();

    self.message = function (options) {
        if (options.message) {
            $('#message').removeClass('fadeIn');
            $('#message').addClass('fadeOut');
            setTimeout(function () {
                self.content.message(options.message);
                $('#message').removeClass('fadeOut');
                $('#message').addClass('fadeIn');
            }, 500);
        } else {
            $('#message').removeClass('fadeIn');
            $('#message').addClass('fadeOut');
            modalAssistant.content.message('');
        }
        if (options.description) {
            $('#description').removeClass('fadeIn');
            $('#description').addClass('fadeOut');
            setTimeout(function () {
                self.content.description(options.message);
                $('#description').removeClass('fadeOut');
                $('#description').addClass('fadeIn');
            }, 500);
        } else {
            $('#description').removeClass('fadeIn');
            $('#description').addClass('fadeOut');
            modalAssistant.content.description('');
        }
    }

    self.guidedTour = function (options) {

        $('#assistant-modal-home').removeClass('fadeIn');
        $('#assistant-modal-home').addClass('fadeOut');

        setTimeout(function () {
            $('#assistant-modal-home').remove();

            var el = $(require('./guided.html'));

            $('.modal-body').append(el);

            switch (options.purpose) {
              case 'e-commerce':
                options.progressBar = [{step: 'Organization', active: true},{step: 'Reviews', active: false},{step: 'Favorite', active: false},{step: 'Payment', active: false},{step: 'Finish', active: false}];
                break;
              case 'blog':
                options.progressBar = [{step: 'Organization', active: true},{step: 'Community', active: false},{step: 'Favorite', active: false},{step: 'Comments', active: false},{step: 'Finish', active: false}];
                break;
              case 'social-network':
                options.progressBar = [{step: 'Comments', active: true},{step: 'Likes', active: false},{step: 'Relationships', active: false},{step: 'Finish', active: false}];
                break;
              case 'crowdsourcing':
                options.progressBar = [{step: 'Tasks', active: true},{step: 'Organization', active: false},{step: 'Finish', active: false}];
                break;
            }

            self.app = new GuidedTourViewModel(options, self.close);

            ko.applyBindings(self.app, el[0]);
        }, 500);
    }

    ko.applyBindings(self.content, el.find('#assistant-modal-home')[0]);
    el.modal('show').on('hidden.bs.modal', tearDown);

    return self;
}

exports.ModalAssistant = ModalAssistant;
