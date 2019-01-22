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
        detailsFound = false;

    tree['pattern-container'] = cell;

    var candidates = _.chain(embeds)
                      .filter(function (child) {
                          return _.chain(child.attributes.pattern)
                                  .filter(function (p) {
                                      return p.state === 'start step'
                                  })
                                  .value().length > 0
                      })
                      .filter(function (e) {
                          return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'list'
                      })
                      .value();

    _.forEach(candidates, function (candidate) {
        var path = [{name: 'step-1-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: 'step-1-flow',linkType: 'ifml.NavigationFlow', linkBindings: true, revisit: false},
                    {name: 'step-2-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: undefined, revisit: false}];

        listFound = graphNavigation({
            cell: candidate,
            graph: graph,
            value: 'multilevel master detail',
            path: _.cloneDeep(path),
            tree: tree
        });

        if (listFound) {
            var count = 2,
                nextStep = true;

            while (nextStep) {
                path = [{name: 'step-' + count + '-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: 'step-' + count + '-flow', linkType: 'ifml.NavigationFlow', linkBindings: true, revisit: true},
                        {name: 'step-' + (count + 1) + '-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined, linkType: undefined, revisit: false}];

                nextStep = graphNavigation({
                    cell: tree['step-' + count + '-list'],
                    graph: graph,
                    value: 'multilevel master detail',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if (nextStep) {
                    count++;
                }
            }

            path = [{name: 'step-' + count + '-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'result-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

            detailsFound = graphNavigation({
                cell: tree['step-' + count + '-list'],
                graph: graph,
                value: 'multilevel master detail',
                path: _.cloneDeep(path),
                tree: tree
            });

            if (detailsFound) {
                options.pattern.tree = tree;
                swal(
                  'Multilevel Master Detail Found',
                  'Click on the pattern settings to manage the pattern',
                  'success'
                ).then((result) => {
                    options.load({patterns: options.patterns, type: 'update', cell: cell});
                });
                return false;
            }
        }
    });
    if(!(listFound && detailsFound)){
        swal(
          'Multilevel Master Detail Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
