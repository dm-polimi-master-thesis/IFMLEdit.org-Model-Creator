// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    swal = require('sweetalert2'),
    graphNavigation = require('../../utilities/graphNavigation.js').graphNavigation;

function brain(options) {
  var tree = [],
      cell = options.cell,
      graph = options.cell.graph,
      embeds = cell.getEmbeddedCells({deep:'true'}),
      round = false,
      trip = false;

  tree['pattern-container'] = cell;

  var candidates = _.filter(embeds, function (e) {return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'form'});

  _.forEach(candidates, function (candidate) {
      var path = [{name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                  {name: 'validate-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

      round = graphNavigation({
          cell: candidate,
          graph: graph,
          value: 'input data validation',
          path: _.cloneDeep(path),
          tree: tree
      });

      if (round) {
          path = [{name: 'validate-action', type:'ifml.Action', stereotype: undefined, linkName: 'failed-validate-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                  {name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

          trip = graphNavigation({
              cell: tree['validate-action'],
              graph: graph,
              value: 'input data validation',
              path: _.cloneDeep(path),
              tree: tree
          });
      }

      if (round && trip) {
          options.pattern.tree = tree;
          swal(
            'Input Data Validation Found',
            'Click on the pattern settings to manage the pattern',
            'success'
          ).then((result) => {
              options.load({patterns: options.patterns, type: 'update', cell: cell});
          });
          return false;
      }
  });
  if(!(round && trip)){
      swal(
        'Input Data Validation Not Found',
        'Check if all the containers, components and connections of the pattern are built and configured correctly',
        'error'
      );
  }
}

exports.brain = brain;
