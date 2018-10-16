// Copyright (c) 2018, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    toViewContainer = require('../../utilities.js').toViewContainer;

function transformer(wizard) {
  var model = {
      viewContainers: [],
      actions: [],
      relations: []
  }
  
  var steps = _(wizard.steps);

  steps.forEach(function (step, index, collection) {
    toViewContainer(step,index, collection, wizard);

  })
}

exports.tranformer = transformer;
