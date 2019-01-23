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
        formFound = false,
        detailsFound = false,
        backward = false,
        structureDetected = false,
        count;

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
                          return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'form'
                      })
                      .value();

    _.forEach(candidates, function (candidate) {
        var path = [{name: 'step-1-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-step-1-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'validate-step-1-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

        var result = graphNavigation({
            cell: candidate,
            graph: graph,
            value: 'wizard',
            path: _.cloneDeep(path),
            tree: tree
        });

        if(result) {
            path = [{name: 'validate-step-1-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'step-2-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: false}];

            result = graphNavigation({
                cell: tree['validate-step-1-action'],
                graph: graph,
                value: 'wizard',
                path: _.cloneDeep(path),
                tree: tree
            });

            if (result) {
                path = [{name: 'step-2-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-step-2-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                        {name: 'validate-step-2-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                        {name: 'step-3-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: false}];

                formFound = graphNavigation({
                    cell: tree['step-2-form'],
                    graph: graph,
                    value: 'wizard',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if(!formFound) {
                    path = [{name: 'step-2-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-step-2-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                            {name: 'validate-step-2-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                            {name: 'result-details', type:'ifml.ViewComponent', stereotype: 'details',linkName: undefined, linkType: undefined, revisit: false}];

                    detailsFound = graphNavigation({
                        cell: tree['step-2-form'],
                        graph: graph,
                        value: 'wizard',
                        path: _.cloneDeep(path),
                        tree: tree
                    });

                    if (detailsFound) {
                        count = 2;
                    }
                }
            }
        }

        if (formFound) {
            var nextForm = true;

            count = 3;

            while (nextForm) {
                path = [{name: 'step-' + count + '-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-step-' + count + '-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                        {name: 'validate-step-' + count + '-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                        {name: 'step-' + (count + 1) + '-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: false}];

                nextForm = graphNavigation({
                    cell: tree['step-' + count + '-form'],
                    graph: graph,
                    value: 'wizard',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if (nextForm) {
                    count++;
                }
            }

            path = [{name: 'step-' + count + '-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'validate-step-' + count + '-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'validate-step-' + count + '-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'result-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined, linkType: undefined, revisit: false}];

            detailsFound = graphNavigation({
                cell: tree['step-' + count + '-form'],
                graph: graph,
                value: 'wizard',
                path: _.cloneDeep(path),
                tree: tree
            });
        }
        if (detailsFound) {
            var countDown = count;

            path = [{name: 'result-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: 'previous-step-' + count + '-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'previous-step-' + countDown + '-action', type:'ifml.Action', stereotype: undefined, linkName: 'to-step-' + countDown + '-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'step-' + countDown +'-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

            var result = graphNavigation({
                cell: tree['result-details'],
                graph: graph,
                value: 'wizard',
                path: _.cloneDeep(path),
                tree: tree
            });

            while (result && countDown > 1) {
                path = [{name: 'step-' + countDown +'-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'previous-step-' + countDown + '-flow', linkType: 'ifml.NavigationFlow', revisit: true},
                        {name: 'previous-step-' + (countDown - 1) + '-action', type:'ifml.Action', stereotype: undefined, linkName: 'to-step-' + (countDown - 1) +'-flow', linkType: 'ifml.NavigationFlow', revisit: false},
                        {name: 'step-' + (countDown - 1) + '-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

                result = graphNavigation({
                    cell: tree['step-' + countDown + '-form'],
                    graph: graph,
                    value: 'wizard',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                countDown--;
                if (result && countDown === 1) {
                    backward = true;
                }
            }

            if (backward) {
                var countUp = countDown,
                    failedFlow = true;

                while (failedFlow && countUp <= count) {
                    var links = _.filter(graph.getConnectedLinks(tree['validate-step-' + countUp + '-action'],{deep:'true',outbound:'true'}), function (link) {return link.attributes.target.id === tree['step-' + countUp + '-form'].attributes.id});

                    if (links.length === 1) {
                        tree['failed-validate-step-' + countUp + '-flow'] = links[0];
                        countUp++;
                    } else {
                        failedFlow = false;
                    }
                }
                if (failedFlow) {
                    structureDetected = true;
                    options.pattern.tree = tree;
                    console.log(tree);
                    swal(
                      'Wizard Found',
                      'Click on the pattern settings to manage the pattern',
                      'success'
                    ).then((result) => {
                        options.load({patterns: options.patterns, type: 'update', cell: cell});
                    });
                    return false;
                }
            }
        }
    });
    if(!(structureDetected)){
        swal(
          'Wizard Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
