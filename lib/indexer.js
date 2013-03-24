
var lev = require('./levenshtein')
	, Dawg = require('./dawg')
	, stop_words = require('./stop_words')
	, memStore = require('./stores/memory');


function Index (name, args) {
	args = (typeof args === 'object') ? args : {};

	this._algorithm = args.algorithm || 'transposition';
	this._distance = args.distance || 1;
	this._sort_matches = args.sort_matches || true;
	this._include_distance = args.include_distance || true;
	this._case_insensitive = args.case_insensitive || true;

	this._store_name = name;
	if (args.store && typeof args.store === 'object') {
		this._store = args.store.init(this._store_name);
	} else throw new Error ('Must pass in a valid store');
}

module.exports = Index;

Index.prototype._levenshtein = lev;

Index.prototype.index = function index(ary, id) {
	var _this = this, d, ds = [], x;

	if (ary instanceof Array) {
		ary.forEach(function(item) {
			x = _this.tokenize(item);
			d = new Dawg(x);
			ds.push(d);
		});
	} else if (typeof ary === 'string') {
		x = _this.tokenize(ary)
		d = new Dawg(x);
		ds.push(d);
	}
	//_this._store.push({dawgs: ds, id: id || 0});
	_this._store.set(_this._store_name, {dawgs: ds, id: id || 0});

	return this;
}

Index.prototype.search = function search(q, distance, cb) {
	var _this = this, t, x, z = [], resp = [];
	if (typeof distance === 'function') {
		cb = distance;
		distance = _this._distance;
	}

	process.nextTick(function() {
		q = _this.tokenize(q);

		_this._store.each(_this._store_name, function(v) {
			v.dawgs.forEach(function(d) {
				t = lev.transducer({
					dictionary: d,
					dictionary_type: 'dawg',
					algorithm: _this._algorithm,
					sort_matches: _this._sort_matches,
					include_distance: _this._include_distance,
					case_insensitive: _this._case_insensitive
				});
				
				q.forEach(function(i) {
					x = t(i, distance);
					z = z.concat(x);
				});
			});
			if (z.length) resp.push({id: v.id, terms: z, count: z.length, query: q});
			z = [];
		});

		return cb(null, resp);
	});

	return this;
}

Index.prototype.tokenize = function tokenize(str) {
	var x = str.replace(/[/\/()\!\^\&\*\.\:\?]/ig,' ').toLowerCase().split(' ');
	x = x.filter(function(i) {
		return !stop_words(i);
	});

	return x;
}