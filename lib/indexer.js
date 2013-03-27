
var lev = require('./levenshtein')
	, Dawg = require('./dawg')
	, stop_words = require('./stop_words')
	, MemStore = require('./stores/memory');

/*
* Constructor for Index class responsible for indexing and searching data
* @key: index name to be used for combining data into similar indexes
* @args: arguments to be passed to the automata transducer
*/
function Index (key, args) {
	var s;
	args = (typeof args === 'object') ? args : {};
	if (!key) throw new Error('A unique key to the index must be provided');

	this._algorithm = args.algorithm || 'transposition';
	this._distance = args.distance || 1;
	this._sort_matches = args.sort_matches || true;
	this._include_distance = args.include_distance || true;
	this._case_insensitive = args.case_insensitive || true;

	this._store_key = key;
	s = (args.store && typeof args.store === 'object') ? args.store : new MemStore();
	this._store = s.init(this._store_key);
}

/*
*  Levenshtein automata object incase user needs to access it directly
*/
Index.prototype._levenshtein = lev;

/*
* Main data indexing function
* @ary: ary of text strings to be parsed and indexed
* @id: document id to associate with the indexed data.  Will be returned if query matches this data
*/
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

	_this._store.set({dawgs: ds, id: id || 0});

	return this;
}

/*
* Main search function
* @q: query string
* @distance: optional maximum edit distance
* @cb: callback accepting error and array of responses
*/
Index.prototype.search = function search(q, distance, cb) {
	var _this = this, t, x, z = [], resp = [], iterator;
	if (typeof distance === 'function') {
		cb = distance;
		distance = _this._distance;
	}

	q = _this.tokenize(q);

	iterator = function(v){
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
	}

	_this._store.each(iterator, function(err) {
		if (!err) return cb(null, resp);
		else return cb(new Error('Failed to iterator over search results - ', e));
	});

	return this;
}

/*
* Tokenizer function for stripping out stop words, bad characters and splitting into words
* @str: string to tokenize
* returns: array of tokenized words
*/
Index.prototype.tokenize = function tokenize(str) {
	var x = str.replace(/[/\/()\!\^\&\*\.\:\?]/ig,' ').toLowerCase().split(' ');
	x = x.filter(function(i) {
		return !stop_words(i);
	});

	return x;
}


function IndexFactory() {}

module.exports = new IndexFactory();

/*
* Index factory function
* @key: create an index for a specific key
* @args: any arguments that should be passed to the Indexer
*/
IndexFactory.prototype.createIndex = function createIndex(key, args) {
	return new Index(key, args);
}

/*
* MemoryStore factory
* returns: new memory store object
*/
IndexFactory.prototype.MemoryStore = function MemoryStore() {
	return new MemStore();
}

/*
* RedisStore factory
* returns: redis store object to be instantiated with redis arguments
*/
IndexFactory.prototype.RedisStore = function RedisStore() {
	return require('./stores/redis');
}