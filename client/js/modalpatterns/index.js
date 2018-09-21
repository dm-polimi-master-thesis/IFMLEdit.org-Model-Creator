// Copyright (c) 2018, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    $ = require('jquery'),
    ko = require('knockout'),
    document = require('document');

function PatternViewModel(options, close){
    var self = this;
    self.patterns = ko.observableArray(options.patterns);
    self.selected = ko.observable(self.patterns()[0]);
    self.config = ko.observable(undefined);
    self.load = function(){
        //options.load();
        self.close();
    }
    self.close = close;
}

function ModalPatterns(options){
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
        list = $(require('./list.html'));

    $(document.body).append(el);
    $(el.find('.content')[0]).append(list);

    function tearDown(){
        el.remove();
    }

    ko.applyBindings(new PatternViewModel({patterns:patterns, load:load}, function () { el.modal('hide'); }), el.find('.modal-content')[0]);

    el.modal('show').on('hidden.bd.modal', tearDown);
}

exports.ModalPatterns = ModalPatterns;
