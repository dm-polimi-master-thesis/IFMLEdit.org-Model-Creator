// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash'),
    swal = require('sweetalert2');

function brain(options) {
    var tree = [],
        cell = options.cell,
        graph = options.cell.graph,
        embeds = cell.getEmbeddedCells({deep:'true'}),
        found = false;

    tree['pattern-container'] = cell;

    _.forEach(embeds, function (child) {
        var childPattern = _.filter(child.attributes.pattern, function (p) {return p.value === 'alphabetical filter';}),
            attributes = child.attributes;
        if(childPattern.length > 0 && attributes.type === 'ifml.ViewComponent' && attributes.stereotype === 'list') {
            var links = _.filter(graph.getConnectedLinks(child,{deep:'true', outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});

            _.forEach(links, function (l1) {
                var targetList = l1.collection._byId[l1.attributes.target.id];
                if (targetList && targetList.attributes.type === 'ifml.ViewComponent' && targetList.attributes.stereotype === 'list') {
                    var targetListPattern = _.filter(targetList.attributes.pattern, function (p) {return p.value === 'alphabetical filter'});
                    if(targetListPattern.length > 0) {
                        links = _.filter(graph.getConnectedLinks(targetList,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});
                        _.forEach(links, function (l2) {
                            var targetDetails = l2.collection._byId[l2.attributes.target.id];
                            if (targetDetails && targetDetails.attributes.type === 'ifml.ViewComponent' && targetDetails.attributes.stereotype === 'details') {
                                var targetDetailsPattern = _.filter(targetDetails.attributes.pattern, function (p) {return p.value === 'alphabetical filter'});
                                if(targetDetailsPattern.length > 0) {
                                    tree['alphabet-list'] = child;
                                    tree['filter-link'] = l1;
                                    tree['results-list'] = targetList;
                                    tree['result-details'] = targetDetails;

                                    options.pattern.tree = tree;

                                    swal(
                                      'Alphabetical Pattern Found',
                                      'Click on the pattern settings to manage the pattern',
                                      'success'
                                    ).then((result) => {
                                        options.load({patterns: options.patterns, type: 'update', cell: cell});
                                    });

                                    found = true;
                                    return false;
                                }
                            }
                        });
                    }
                }
                if(found){
                    return false;
                }
            });
        }
        if(found){
            return false;
        }
    });

    if(!found){
        swal(
          'Alphabetical Filter Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
