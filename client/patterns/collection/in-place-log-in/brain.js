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
      logFound = false,
      editorFound = false;

  tree['pattern-container'] = cell;

  var candidates = _.filter(embeds, function (e) {return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'form'});

  _.forEach(candidates, function (candidate) {
      var path = [{name: 'log-in-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'log-in-send-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                  {name: 'log-in-send-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

      var result = graphNavigation({
          cell: candidate,
          graph: graph,
          value: 'in-place log in',
          path: _.cloneDeep(path),
          tree: tree
      });

      if (result) {
          var actionCandidates = _.filter(embeds, function (e) {return e.attributes.type === 'ifml.Action'});
          path = [{name: 'content-send-action', type:'ifml.Action', stereotype: undefined, linkName: 'log-in-flow',linkType: 'ifml.NavigationFlow', revisit: false},
                  {name: 'log-in-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: true},
                  {name: 'log-in-send-action', type:'ifml.Action', stereotype: undefined, linkName: 'failed-log-in-send-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                  {name: 'log-in-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

          _.forEach(actionCandidates, function (candidate) {
              logFound = graphNavigation({
                  cell: candidate,
                  graph: graph,
                  value: 'in-place log in',
                  path: _.cloneDeep(path),
                  tree: tree
              });

              if(logFound){
                  return false;
              }
          });
      }

      if(logFound) {
          path = [{name: 'content-send-action', type:'ifml.Action', stereotype: undefined, linkName: 'failed-editor-flow',linkType: 'ifml.NavigationFlow', revisit: true},
                  {name: 'editor-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'editor-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                  {name: 'content-send-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: true}];

          editorFound = graphNavigation({
              cell: tree['content-send-action'],
              graph: graph,
              value: 'in-place log in',
              path: _.cloneDeep(path),
              tree: tree
          });

          options.pattern.tree = tree;
          console.log(tree);
          swal(
            'In-Place Log In Found',
            'Click on the pattern settings to manage the pattern',
            'success'
          ).then((result) => {
              options.load({patterns: options.patterns, type: 'update', cell: cell});
          });
          return false;
      } else {
        tree = [];
        tree['pattern-container'] = cell;
      }
  });
  if(!logFound){
      console.log(tree);
      swal(
        'In-Place Log In Not Found',
        'Check if all the containers, components and connections of the pattern are built and configured correctly',
        'error'
      );
  }
}

exports.brain = brain;
