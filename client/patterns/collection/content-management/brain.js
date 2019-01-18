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
        deleteFound = false,
        dataEntryFound = false,
        detailsPageFound = false;

    tree['pattern-container'] = cell;

    _.forEach(embeds, function (child) {
        var childPattern = _.filter(child.attributes.pattern, function (p) {return p.value === 'content management' && !p.active;}),
            attributes = child.attributes;
        if(childPattern.length > 0 && attributes.type === 'ifml.ViewComponent' && attributes.stereotype === 'list') {
            var links = _.filter(graph.getConnectedLinks(child,{deep:'true', outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});

            _.forEach(links, function (l1) {
                var targetDetails = l1.collection._byId[l1.attributes.target.id];
                if (targetDetails && targetDetails.attributes.type === 'ifml.ViewComponent' && targetDetails.attributes.stereotype === 'details') {
                    var targetDetailsPattern = _.filter(targetDetails.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                    if(targetDetailsPattern.length > 0) {
                        var linksDetails = _.filter(graph.getConnectedLinks(targetDetails,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});
                        _.forEach(linksDetails, function (l2) {
                            var targetAction = l2.collection._byId[l2.attributes.target.id];
                            if (targetAction && targetAction.attributes.type === 'ifml.Action') {
                                var targetActionPattern = _.filter(targetAction.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                                if(targetActionPattern.length > 0) {
                                    tree['page-list'] = child;
                                    tree['delete-page-details'] = targetDetails;
                                    tree['delete-action'] = targetAction;

                                    links = _.filter(links, function (l) {return l.id !== l1.id });

                                    deleteFound = true;
                                    return false;
                                }
                            }
                        });
                    }
                }
                if(deleteFound){
                  return false;
                }
            });
            if (deleteFound) {
                _.forEach(links, function (l1) {
                    var targetLoadAction = l1.collection._byId[l1.attributes.target.id];
                    if (targetLoadAction && targetLoadAction.attributes.type === 'ifml.Action') {
                        var targetLoadActionPattern = _.filter(targetLoadAction.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                        if(targetLoadActionPattern.length > 0) {
                            var linksLoadAction = _.filter(graph.getConnectedLinks(targetLoadAction,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});
                            _.forEach(linksLoadAction, function (l2) {
                                var targetForm = l2.collection._byId[l2.attributes.target.id];
                                if (targetForm && targetForm.attributes.type === 'ifml.ViewComponent' && targetForm.attributes.stereotype === 'form') {
                                    var targetFormPattern = _.filter(targetForm.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                                    if(targetFormPattern.length > 0) {
                                        var linksForm = _.filter(graph.getConnectedLinks(targetForm,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});
                                        _.forEach(linksForm, function (l3) {
                                            var targetSaveAction = l3.collection._byId[l3.attributes.target.id];
                                            if (targetSaveAction && targetSaveAction.attributes.type === 'ifml.Action') {
                                                var targetSaveActionPattern = _.filter(targetSaveAction.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                                                if(targetSaveActionPattern.length > 0) {
                                                    tree['load-content-action'] = targetLoadAction;
                                                    tree['load-data-entry-flow'] = l2;
                                                    tree['data-entry-form'] = targetForm;
                                                    tree['save-data-entry-flow'] = l3;
                                                    tree['save-action'] = targetSaveAction;

                                                    var linksSaveAction = _.filter(graph.getConnectedLinks(targetSaveAction,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});

                                                    linksSaveAction = _.filter(linksSaveAction, function (l4) { return l4.attributes.target.id === targetForm.id })

                                                    if(linksSaveAction.length > 0){
                                                        tree['failed-data-entry-flow'] = linksSaveAction[0];
                                                    }

                                                    links = _.filter(links, function (l) {return l.id !== l1.id });

                                                    dataEntryFound = true;
                                                    return false;
                                                }
                                            }
                                        });
                                    }
                                }
                                if(dataEntryFound) {
                                  return false;
                                }
                            });
                        }
                    }
                    if(dataEntryFound){
                      return false;
                    }
                });
                _.forEach(links, function (l1) {
                    var targetDetails = l1.collection._byId[l1.attributes.target.id];
                    if (targetDetails && targetDetails.attributes.type === 'ifml.ViewComponent' && targetDetails.attributes.stereotype === 'details') {
                        var targetDetailsPattern = _.filter(targetDetails.attributes.pattern, function (p) {return p.value === 'content management' && !p.active});
                        if(targetDetailsPattern.length > 0) {
                            tree['page-details'] = targetDetails;
                            detailsPageFound = true;

                            if(dataEntryFound) {
                              var linksDetails = _.filter(graph.getConnectedLinks(targetDetails,{deep:'true',outbound:'true'}), function (l) {return l.attributes.type === 'ifml.NavigationFlow'});

                              linksDetails = _.filter(linksDetails, function (l2) { return l2.attributes.target.id === tree['data-entry-form'].id })

                              if(linksDetails.length > 0){
                                  tree['modify-flow'] = linksDetails[0];
                              }
                            }
                        }
                    }
                    if(detailsPageFound){
                      return false;
                    }
                });
            }
        }
        if(deleteFound){
          options.pattern.tree = tree;
          options.pattern.active = true;

          console.log(tree);

          swal(
            'Content Management Found',
            'Click on the pattern settings to manage the pattern',
            'success'
          );
          return false;
        }
    });
    if(!(deleteFound)){
        swal(
          'Content Management Not Found',
          'Check if all the containers, components and connections of the pattern are built and configured correctly',
          'error'
        );
    }
}

exports.brain = brain;
