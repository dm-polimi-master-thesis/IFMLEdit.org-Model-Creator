// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function graphNavigation(options) {
    var cell = options.cell,
        graph = options.graph,
        value = options.value,
        path = options.path,
        tree = options.tree,
        found = false,
        pattern = _.filter(cell.attributes.pattern, function (p) {return p.value === value}),
        attributes = cell.attributes,
        step = path.shift(),
        visited = [];

    for (var key in tree) {
      visited.push(tree[key].id);
    };
    if ((!step.revisit && !_.includes(visited,cell.id)) || (step.revisit && _.includes(visited,cell.id))) {

        if(pattern.length > 0 && attributes.type === step.type) {
            if(!step.stereotype || attributes.stereotype === step.stereotype){
                if(step.linkType){
                    var links = _.filter(graph.getConnectedLinks(cell,{deep:'true'}), function (link) {return link.attributes.type === step.linkType});

                    if (step.linkBindings){
                        links = _.filter(links, function (link) { return link.attributes.bindings.length > 0 })
                    }

                    _.forEach(links, function (link) {
                        var target = link.collection._byId[link.attributes.target.id];

                        found = graphNavigation({
                            cell: target,
                            value: value,
                            graph: graph,
                            path: _.cloneDeep(path),
                            tree: tree
                        });
                        if(found){
                            tree[step.name] = cell;
                            if(step.linkName){
                                tree[step.linkName] = link;
                            }
                            return false;
                        }
                    });
                    return found;
                } else {
                    tree[step.name] = cell;
                    return true;
                }
            }
        }
    }
    return false;
}

exports.graphNavigation = graphNavigation;
