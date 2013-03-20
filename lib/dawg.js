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

var DawgNode = require('./DawgNode');

function Dawg(dictionary) {
  var word, _i, _len;
  this.previous_word = '';
  this.root = new DawgNode();
  this.unchecked_nodes = [];
  this.minimized_nodes = {};
  for (_i = 0, _len = dictionary.length; _i < _len; _i++) {
    word = dictionary[_i];
    this.insert(word);
  }
  this.finish();
}

module.exports = Dawg;

Dawg.prototype.insert = function(word) {
  var character, i, next_node, node, previous_word, unchecked_nodes, upper_bound;
  i = 0;
  previous_word = this.previous_word;
  upper_bound = word.length < previous_word.length ? word.length : previous_word.length;
  while (i < upper_bound && word[i] === previous_word[i]) {
    i += 1;
  }
  this.minimize(i);
  unchecked_nodes = this.unchecked_nodes;
  if (unchecked_nodes.length === 0) {
    node = this.root;
  } else {
    node = unchecked_nodes[unchecked_nodes.length - 1][2];
  }
  while (character = word[i]) {
    next_node = new DawgNode();
    node.edges[character] = next_node;
    unchecked_nodes.push([node, character, next_node]);
    node = next_node;
    i += 1;
  }
  node.is_final = true;
  this.previous_word = word;
};

Dawg.prototype.finish = function() {
  this.minimize(0);
};

Dawg.prototype.minimize = function(lower_bound) {
  var character, child, child_key, j, minimized_nodes, parent, unchecked_nodes, _ref;
  minimized_nodes = this.minimized_nodes;
  unchecked_nodes = this.unchecked_nodes;
  j = unchecked_nodes.length;
  while (j > lower_bound) {
    _ref = unchecked_nodes.pop(), parent = _ref[0], character = _ref[1], child = _ref[2];
    child_key = child.toString();
    if (child_key in minimized_nodes) {
      parent.edges[character] = minimized_nodes[child_key];
    } else {
      minimized_nodes[child_key] = child;
    }
    j -= 1;
  }
};

Dawg.prototype.accepts = function(word) {
  var edge, node, _i, _len;
  node = this.root;
  for (_i = 0, _len = word.length; _i < _len; _i++) {
    edge = word[_i];
    node = node.edges[edge];
    if (!node) {
      return false;
    }
  }
  return node.is_final;
};