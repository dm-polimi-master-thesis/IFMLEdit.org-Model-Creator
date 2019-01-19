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
        listFound = false,
        dataEntryFound = false,
        detailsPageFound = false;

    tree['pattern-container'] = cell;

    var path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'delete-page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'delete-action', type:'ifml.Action', stereotype: undefined, linkName: undefined,linkType: undefined, revisit: false}];

    _.forEach(embeds, function (child) {
        var result = graphNavigation({
            cell: child,
            graph: graph,
            value: 'content management',
            path: _.cloneDeep(path),
            tree: tree
        });

        if(result) {
            listFound = true;
            return false;
        }
    });

    var remainder = [],
        visited = [];
    if (listFound) {
        var list = _.cloneDeep(tree['page-list']);

        for (var key in tree) {
          if(key !== 'page-list'){
              visited.push(tree[key]);
          }
        };

        path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: true},
                {name: 'load-content-action', type:'ifml.Action', stereotype: undefined, linkName: 'load-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'save-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'save-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

        remainder = _.difference(embeds,visited);
    } else {
        listFound = false;

        path = [{name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'save-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'save-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

        remainder = embeds;
    }

    _.forEach(remainder, function (child) {
        var result = graphNavigation({
            cell: child,
            graph: graph,
            value: 'content management',
            path: _.cloneDeep(path),
            tree: tree
        });

        if (result) {
            if(listFound && list.id === tree['page-list'].id) {
                dataEntryFound = true;
            } else {
                dataEntryFound = true;
                detailsPageFound = true;
            }

            var linksSaveAction = _.chain(graph.getConnectedLinks(tree['save-action'],{deep:'true',outbound:'true'}))
                                   .filter(function (l) {return l.attributes.type === 'ifml.NavigationFlow'})
                                   .filter(function (l) { return l.attributes.target.id === tree['data-entry-form'].id })
                                   .value();

            if(linksSaveAction.length > 0){
                tree['failed-data-entry-flow'] = linksSaveAction[0];
            }
            return false;
        }
    });

    if (listFound) {
      visited = [];

      for (var key in tree) {
        if(key !== 'page-list'){
            visited.push(tree[key]);
        }
      };

      path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: true},
              {name: 'page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

      remainder = _.difference(embeds,visited);
      console.log(embeds);
      console.log(visited);
      console.log(remainder);
      console.log(_.intersection(embeds,visited));
      _.forEach(remainder, function (child) {
          var result = graphNavigation({
              cell: child,
              graph: graph,
              value: 'content management',
              path: _.cloneDeep(path),
              tree: tree
          });

          if (result && list.id === tree['page-list'].id) {
              detailsPageFound = true;

              if(dataEntryFound){
                  var linksDetails = _.chain(graph.getConnectedLinks(tree['page-details'],{deep:'true',outbound:'true'}))
                                      .filter(function (l) {return l.attributes.type === 'ifml.NavigationFlow'})
                                      .filter(function (l) {return l.attributes.target.id === tree['data-entry-form'].id })
                                      .value();

                  if(linksDetails.length > 0){
                      tree['modify-flow'] = linksDetails[0];
                  }
              }
          }
      });
    }
    if((listFound && dataEntryFound) || (listFound && detailsPageFound) || (dataEntryFound && detailsPageFound)){
      options.pattern.tree = tree;

      console.log(tree);

      swal(
        'Content Management Found',
        'Click on the pattern settings to manage the pattern',
        'success'
      ).then((result) => {
          options.load({patterns: options.patterns, type: 'update', cell: cell});
      });
    } else {
      console.log(tree);
      console.log(dataEntryFound);
      console.log(listFound);
      console.log(detailsPageFound);
      swal(
        'Content Management Not Found',
        'Check if all the containers, components and connections of the pattern are built and configured correctly',
        'error'
      );
    }
}

exports.brain = brain;
