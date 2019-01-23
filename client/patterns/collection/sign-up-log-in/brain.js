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
        logInFound = false,
        signUpFound = false,
        structureDetected = false;

    tree['pattern-container'] = cell;

    var candidates = _.chain(embeds)
                      .filter(function (child) {
                          return _.chain(child.attributes.pattern)
                                  .filter(function (p) {
                                      return p.state === 'log in'
                                  })
                                  .value().length > 0
                      })
                      .filter(function (e) {
                          return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'form'
                      })
                      .value();

    _.forEach(candidates, function (candidate) {
        var path = [{name: 'log-in-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'log-in-flow',linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'log-in-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

        var result = graphNavigation({
            cell: candidate,
            graph: graph,
            value: 'sign up and log in',
            path: _.cloneDeep(path),
            tree: tree
        });

        if (result) {
            path = [{name: 'log-in-action', type:'ifml.Action', stereotype: undefined, linkName: 'failed-log-in-flow',linkType: 'ifml.NavigationFlow', revisit: true},
                    {name: 'log-in-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

            logInFound = graphNavigation({
                cell: tree['log-in-action'],
                graph: graph,
                value: 'sign up and log in',
                path: _.cloneDeep(path),
                tree: tree
            });

            if (logInFound) {
                return false;
            }
        }
    });

    if (logInFound) {
        candidates = _.chain(embeds)
                      .filter(function (child) {
                          return _.chain(child.attributes.pattern)
                                  .filter(function (p) {
                                      return p.state === 'sign up'
                                  })
                                  .value().length > 0
                      })
                      .filter(function (e) {
                          return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'form'
                      })
                      .value();

        _.forEach(candidates, function (candidate) {
            var path = [{name: 'sign-up-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: 'sign-up-flow',linkType: 'ifml.NavigationFlow', revisit: false},
                        {name: 'sign-up-action', type:'ifml.Action', stereotype: undefined, linkName: undefined, linkType: undefined, revisit: false}];

            var result = graphNavigation({
                cell: candidate,
                graph: graph,
                value: 'sign up and log in',
                path: _.cloneDeep(path),
                tree: tree
            });

            if (result) {
                path = [{name: 'sign-up-action', type:'ifml.Action', stereotype: undefined, linkName: 'failed-sign-up-flow',linkType: 'ifml.NavigationFlow', revisit: true},
                        {name: 'sign-up-form', type:'ifml.ViewComponent', stereotype: 'form', linkName: undefined, linkType: undefined, revisit: true}];

                signUpFound = graphNavigation({
                    cell: tree['sign-up-action'],
                    graph: graph,
                    value: 'sign up and log in',
                    path: _.cloneDeep(path),
                    tree: tree
                });

                if (signUpFound) {
                    return false;
                }
            }
        });
    }
    if (logInFound && signUpFound) {

        var signUpParent = graph.attributes.cells._byId[tree['sign-up-form'].attributes.parent],
            logInParent = graph.attributes.cells._byId[tree['log-in-form'].attributes.parent];

        var logInLinks = _.filter(graph.getConnectedLinks(tree['log-in-form'],{deep:'true', outbound:'true'}), function (link) {return link.attributes.target.id === signUpParent.attributes.id}),
            signUpLinks = _.filter(graph.getConnectedLinks(tree['sign-up-form'],{deep:'true', outbound:'true'}), function (link) {return link.attributes.target.id === logInParent.attributes.id});

        if (logInLinks.length === 1 && signUpLinks.length === 1) {
            structureDetected = true;

            options.pattern.tree = tree;

            swal(
              'Sign Up and Log In Found',
              'Click on the pattern settings to manage the pattern',
              'success'
            ).then((result) => {
                options.load({patterns: options.patterns, type: 'update', cell: cell});
            });
        }
    }
    if(!structureDetected){
        swal(
          'Sign Up and Log In Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
