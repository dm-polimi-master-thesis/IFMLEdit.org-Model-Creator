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
        path = [],
        cell = options.cell,
        graph = options.cell.graph,
        embeds = cell.getEmbeddedCells({deep:'true'}),
        listFound = false,
        dataEntryFound = false,
        detailsPageFound = false;

    tree['pattern-container'] = cell;

    var candidates  = _.filter(embeds, function (child) {return child.attributes.type === 'ifml.ViewComponent' && child.attributes.stereotype === 'list';});

    _.forEach(candidates, function (candidate) {
        path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'delete-page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'delete-action', type:'ifml.Action', stereotype: undefined, linkName: undefined,linkType: undefined, revisit: false}];

        var result = graphNavigation({
            cell: candidate,
            graph: graph,
            value: 'content management',
            path: _.cloneDeep(path),
            tree: tree
        });

        if(result) {
            listFound = true;

            path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'load-content-action', type:'ifml.Action', stereotype: undefined, linkName: 'load-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'save-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'save-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

            _.forEach(candidates, function (candidate) {
                var result = graphNavigation({
                    cell: candidate,
                    graph: graph,
                    value: 'content management',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if (result) {
                    dataEntryFound = true;

                    var linksSaveAction = _.chain(graph.getConnectedLinks(tree['save-action'],{deep:'true',outbound:'true'}))
                                           .filter(function (l) {return l.attributes.type === 'ifml.NavigationFlow'})
                                           .filter(function (l) { return l.attributes.target.id === tree['data-entry-form'].id })
                                           .value();

                    if(linksSaveAction.length > 0){
                        tree['failed-data-entry-flow'] = linksSaveAction[0];
                    }
                }
            });

            path = [{name: 'page-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

            _.forEach(candidates, function (candidate) {
                var result = graphNavigation({
                    cell: candidate,
                    graph: graph,
                    value: 'content management',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if (result) {
                    detailsPageFound = true;

                    if(dataEntryFound){
                        var linksDetails = _.chain(graph.getConnectedLinks(tree['page-details'],{deep:'true',outbound:'true'}))
                                            .filter(function (l) {return l.attributes.type === 'ifml.NavigationFlow'})
                                            .filter(function (l) {return l.attributes.target.id === tree['data-entry-form'].id })
                                            .value();

                        if(linksDetails.length > 0){
                            tree['modify-flow'] = linksDetails[0];
                        }
                        return false;
                    }
                }
            });
        }

        if(listFound && (dataEntryFound || detailsPageFound)){
            return false;
        } else {
            tree = [];
            tree['pattern-container'] = cell;
        }
    });
    if (!(dataEntryFound || detailsPageFound)) {
        var formCandidates = _.filter(embeds, function (child) {return child.attributes.type === 'ifml.ViewComponent' && child.attributes.stereotype === 'form'});
        path = [{name: 'data-entry-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'save-data-entry-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'save-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                {name: 'page-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

        _.forEach(formCandidates, function (candidate) {
            var result = graphNavigation({
                cell: candidate,
                graph: graph,
                value: 'content management',
                path: _.cloneDeep(path),
                tree: tree
            });

            if (result) {
                if(listFound) {
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

                var linksDetails = _.chain(graph.getConnectedLinks(tree['page-details'],{deep:'true',outbound:'true'}))
                                    .filter(function (l) {return l.attributes.type === 'ifml.NavigationFlow'})
                                    .filter(function (l) {return l.attributes.target.id === tree['data-entry-form'].id })
                                    .value();

                if(linksDetails.length > 0){
                    tree['modify-flow'] = linksDetails[0];
                }

                return false;
            }
        });
    }

    if((listFound && dataEntryFound) || (listFound && detailsPageFound) || (dataEntryFound && detailsPageFound)){
      options.pattern.tree = tree;

      swal(
        'Content Management Found',
        'Click on the pattern settings to manage the pattern',
        'success'
      ).then((result) => {
          options.load({patterns: options.patterns, type: 'update', cell: cell});
      });
    } else {
      swal(
        'Content Management Not Found',
        'Check if all the containers, components and connections of the pattern are built and configured correctly',
        'error'
      );
    }
}

exports.brain = brain;
