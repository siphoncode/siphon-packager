
'use strict';

// Maintains internally a data structure of the form
// {path: [child_path, child_path]} etc

var toposort = require('./toposort');

class DependencyGraph {
  constructor(path) {
    this.graph = {};
  }

  addNode(path) {
    if (!this.graph[path]) {
      this.graph[path] = [];
    }
  }

  addChild(parent, child) {
    if (!this.graph[parent]) {
      this.graph[parent] = [];
    }

    this.graph[parent].append(child);
  }

  addChildren(parent, children) {
    if (!this.graph[parent]) {
      this.graph[parent] = children;
    } else {
      var currentChildren = this.graph[parent];
      this.graph[parent] = currentChildren.concat(children);
    }
  }

  getEdges() {
    // Returns an array of edges (these are in turn represented as arrays)
    var edges = [];

    var nodes = Object.keys(this.graph);
    for (var i = 0; i < nodes.length; i++) {
      var nodeDependencies = this.graph[nodes[i]];

      for (var j = 0; j < nodeDependencies.length; j++) {
        var edge = [nodes[i], nodeDependencies[j]];
        edges.push(edge);
      }
    }

    return edges;
  }

  resolveDependencies() {
    // Returns a list of the dependecy paths in the order that they should be
    // executed.
    var edges = this.getEdges();
    var nodes = Object.keys(this.graph);

    var deps = toposort.array(nodes, edges);

    //var dependencyOrder = toposort(graph).reverse();
    var dependencyOrder = deps.reverse();
    return dependencyOrder;
  }
}

module.exports = DependencyGraph;
