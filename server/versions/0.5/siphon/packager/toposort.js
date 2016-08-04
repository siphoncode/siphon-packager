/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */

// Based on https://github.com/marcelklehr/toposort

module.exports = exports = function(edges) {
  return toposort(uniqueNodes(edges), edges);
};

exports.array = toposort;

function toposort(nodes, edges) {
  var cursor = nodes.length;
  var sorted = new Array(cursor);
  var visited = {};
  i = cursor;

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, []);
  }

  return sorted;

  function visit(node, i, predecessors) {

    if (visited[i]) return;
    visited[i] = true;

    // outgoing edges
    var outgoing = edges.filter(function(edge) {
      return edge[0] === node;
    });

    if (i = outgoing.length) {
      var preds = predecessors.concat(node);
      do {
        var child = outgoing[--i][1];
        visit(child, nodes.indexOf(child), preds);
      } while (i);
    }

    sorted[--cursor] = node;
  }
}

function uniqueNodes(arr) {
  var res = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i];
    if (res.indexOf(edge[0]) < 0) res.push(edge[0]);
    if (res.indexOf(edge[1]) < 0) res.push(edge[1]);
  }

  return res;
}
