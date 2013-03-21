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

var lev = require('./lib/levenshtein');
var Dawg = require('./lib/dawg');

function Lev (args) {
	args = (typeof args === 'object') ? args : {};

	this._algorithm = args.algorithm || 'transposition';
	this._distance = args.distance || 2;
	this._sort_matches = args.sort_matches || true;
	this._include_distance = args.include_distance || true;
	this._case_insensitive = args.case_insensitive || true;
	this._store = [];
}

module.exports = Lev;

Lev.prototype._levenshtein = lev;

Lev.prototype.index = function(ary, id) {
	var _this = this, d;

	if (ary instanceof Array) {
		ary.forEach(function(item) {
			d = new Dawg(item.split(' '));
			_this._store.push({dawg: d, id: id || 0});
		});
	} else if (typeof ary === 'string') {
		d = new Dawg(ary.split(' '));
		_this._store.push({dawg: d, id: id || 0});
	}
}

Lev.prototype.search = function(q, distance, cb) {
	var _this = this, t, x, resp = [];
	if (typeof distance === 'function') {
		cb = distance;
		distance = _this._distance;
	}

	process.nextTick(function() {
		_this._store.forEach(function(v) {
			t = lev.transducer({
				dictionary: v.dawg,
				dictionary_type: 'dawg',
				algorithm: _this._algorithm,
				sort_matches: _this._sort_matches,
				include_distance: _this._include_distance,
				case_insensitive: _this._case_insensitive
			});

			x = t(q, distance);
			resp.push(x);
		});
		return cb(null, resp);
	});
}

