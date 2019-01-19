// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function graphNavigation(options) {
    console.log('graphNavigation');
    var cell = options.cell,
        graph = options.graph,
        value = options.value,
        path = options.path,
        tree = options.tree,
        found = false;

    var pattern = _.filter(cell.attributes.pattern, function (p) {return p.value === value}),
        attributes = cell.attributes,
        step = path.shift();

    console.log('step',step);
    console.log('path',_.cloneDeep(path));
    console.log('pattern',pattern);
    console.log('attributes',attributes);

    if(pattern.length > 0 && attributes.type === step.type) {
        console.log(1);
        if(!step.stereotype || attributes.stereotype === step.stereotype){
          console.log(2);
            if(step.linkType){
              console.log(3);
                var links = _.filter(graph.getConnectedLinks(cell,{deep:'true', outbound:'true'}), function (link) {return link.attributes.type === step.linkType});
                _.forEach(links, function (link) {
                  console.log(4);
                    var target = link.collection._byId[link.attributes.target.id];
                    found = graphNavigation({
                        cell: target,
                        value: value,
                        graph: graph,
                        path: _.cloneDeep(path),
                        tree: tree
                    });
                    if(found){
                      console.log(5);
                        tree[step.name] = cell;
                        if(step.linkName){
                            tree[step.linkName] = link;
                        }
                        return false;
                    }
                });
                return found;
            } else {
                console.log(6);
                tree[step.name] = cell;
                return true;
            }
        }
    }
    console.log(7);
    return false;
}

exports.graphNavigation = graphNavigation;
