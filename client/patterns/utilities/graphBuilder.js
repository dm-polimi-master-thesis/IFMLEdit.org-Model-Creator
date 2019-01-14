// Copyright (c) 2019, the IFMLEdit project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true, nomen: true */
"use strict";

var _ = require('lodash');

function graphBuilder (template) {

    var graph = new Graph(),
        templateHash = [];

    _.forEach(template.elements, function (element) {
        templateHash[element.id] = element;
        graph.addNode({
            role: element.attributes.pattern.role || 'pattern-container',
            id: element.id,
        });
    });
    _.forEach(template.relations, function (relation) {
        var source,
            destination;
        if (relation.type === 'hierarchy') {
            source = templateHash[relation.parent].attributes.pattern.role,
            destination = templateHash[relation.child].attributes.pattern.role;
        } else if (relation.type === 'source') {
            source = templateHash[relation.source].attributes.pattern.role,
            destination = templateHash[relation.flow].attributes.pattern.role;
        } else if (relation.type === 'target') {
            source = templateHash[relation.flow].attributes.pattern.role,
            destination = templateHash[relation.target].attributes.pattern.role;
        }
        graph.addDirectedEdge(source, destination);
    });

    return graph;
}

function Graph() {
    var self = this;

    self.nodes = [];

    self.addNode = function (node) {
        self.nodes[node.role] = {
            id: node.id,
            edges: []
        }
    }
    self.addDirectedEdge = function (source,destination) {
        self.nodes[source].edges.push(destination);
    }
}

exports.graphBuilder = graphBuilder;
