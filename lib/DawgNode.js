/*
# Copyright (c) 2012 Dylon Edwards
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# ============================================================================
# Taken and modified for my purposes from the following source:
#  o http://stevehanov.ca/blog/index.php?id=115
# ============================================================================
#
# This class represents a node in the directed acyclic word graph (DAWG,
# a.k.a.  Minimal Acyclic Finite State Automaton, or MA-FSA).  It has a list
# of edges to other nodes.  It has functions for testing whether it is
# equivalent to another node.  Nodes are equivalent if they have identical
# edges, and each identical edge leads to identical states.
#
#
#
# Adapted from original form to a Node.js module by Roy Hasson
#
#
*/

var NEXT_ID = 0;

function DawgNode () {    
    this.id = NEXT_ID;
    NEXT_ID += 1;
    this.is_final = false;
	this.edges = {};
}

module.exports = DawgNode;

DawgNode.prototype.bisect_left = function(edges, edge, lower, upper) {
  var i;
  while (lower < upper) {
    i = (lower + upper) >> 1;
    if (edges[i] < edge) {
      lower = i + 1;
    } else {
      upper = i;
    }
  }
  return lower;
};

DawgNode.prototype.toString = function() {
  var edge, edges, label, node, _ref;
  edges = [];
  _ref = this.edges;
  for (label in _ref) {
    node = _ref[label];
    edge = label + node.id.toString();
    edges.splice(this.bisect_left(edges, edge, 0, edges.length), 0, edge);
  }
  return (this.is_final ? '1' : '0') + edges.join('');
};