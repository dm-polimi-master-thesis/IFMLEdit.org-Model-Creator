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
        found = false;

    tree['pattern-container'] = cell;

    var candidates = _.filter(embeds, function (e) {return e.attributes.type === 'ifml.ViewComponent' && e.attributes.stereotype === 'list'});

    _.forEach(candidates, function (candidate) {
        var path = [{name: 'master-list', type:'ifml.ViewComponent', stereotype: 'list', linkName: undefined,linkType: 'ifml.NavigationFlow', revisit: false},
                    {name: 'master-details', type:'ifml.ViewComponent', stereotype: 'details', linkName: undefined,linkType: undefined, revisit: false}];

        found = graphNavigation({
            cell: candidate,
            graph: graph,
            value: 'master detail',
            path: _.cloneDeep(path),
            tree: tree
        });

        if(found) {
          options.pattern.tree = tree;
          swal(
            'Master Detail Found',
            'Click on the pattern settings to manage the pattern',
            'success'
          ).then((result) => {
              options.load({patterns: options.patterns, type: 'update', cell: cell});
          });
          return false;
        }
    });
    if(!found){
        swal(
          'Master Detail Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
