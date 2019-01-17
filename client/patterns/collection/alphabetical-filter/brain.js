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
        embeds = cell.getEmbeddedCells({deep:'true'});

    tree['pattern-container'] = cell;

    _.forEach(embeds, function (child) {
        var childPattern = _.filter(child.attributes.pattern, function (p) {return p.value === 'alphabetical filter' && !p.active;}),
            attributes = child.attributes;
        if(childPattern.length > 0 && attributes.type === 'ifml.ViewComponent' && attributes.stereotype === 'list') {
            tree['alphabet-list'] = child;
            var links = _.filter(graph.getConnectedLinks(child,{deep:'true', outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});

            _.forEach(links, function (l1) {
                console.log('l1',l1);
                var targetList = l1.collection._byId[l1.attributes.target.id];
                console.log('targetList',targetList);
                if (targetList && targetList.attributes.type === 'ifml.ViewComponent' && targetList.attributes.stereotype === 'list') {
                    tree['results-list'] = targetList;
                    var targetListPattern = _.filter(targetList.attributes.pattern, function (p) {return p.value === 'alphabetical filter' && !p.active});
                    console.log('targetListPattern',targetListPattern);
                    if(targetListPattern.length > 0) {
                        links = _.filter(graph.getConnectedLinks(targetList,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});
                        console.log('links',links);
                        _.forEach(links, function (l2) {
                            var targetDetails = l2.collection._byId[l2.attributes.target.id];
                            console.log('l2',l2);
                            console.log('targetDetails',targetDetails);
                            if (targetDetails && targetDetails.attributes.type === 'ifml.ViewComponent' && targetDetails.attributes.stereotype === 'details') {
                                var targetDetailspattern = _.filter(targetDetails.attributes.pattern, function (p) {return p.value === 'alphabetical filter' && !p.active});
                                console.log('targetDetailspattern',targetDetailspattern);
                                if(targetDetailspattern.length > 0) {
                                    tree['result-details'] = targetDetails;

                                    options.pattern.tree = tree;
                                    options.pattern.active = true;

                                    swal(
                                      'Alphabetical Pattern Found',
                                      'Click on the pattern settings to manage the pattern',
                                      'success'
                                    );

                                    return false;
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.brain = brain;
