/*
* Memory store v.0.0.1
*
*
*/

/*
* MemoryStore constuctor
* @args: search index prefix
*/
function MemoryStore (args) {
	this._indexname = args ? args.index_name : 'searchindex:';
	this._store = {};
}

module.exports = MemoryStore;

/*
* Init function that must be called before any further access.  Typically called by createIndex
* @name: index name to be used
* returns: a new Store object with the current memory instance and given index name
*/
MemoryStore.prototype.init = function(name) {
	return new Store({store: this._store, key: this._indexname+name});
}

/*
* Main Store constructor
* @args: memory store object, index key (aka name)
*/
function Store(args) {
	this._store = args.store;
	this._key = args.key;
	if (Object.keys(this._store).indexOf(this._key) === -1) this._store[this._key] = [];
}

/*
* Get function to retreive data based on id used during indexing
* @id: id of the data used when it was indexed
* @cb: callback returned with error and array of entries
*/
Store.prototype.get = function(id, cb) {
	var ary;

	ary = this._store[this._key].filter(function(v) {
		return id === v.id
	});
	if (cb) process.nextTick(function() { return cb(null, ary); });
	else return ary;
}

/*
* Set function to save an object containing data and id. Id property must be set on object
* @obj: object to save.  If property must be set and reflect the id lookup the data later
* @cb: callback
*/
Store.prototype.set = function(obj, cb) {
	this._store[this._key].push(obj);
	if (cb) process.nextTick(function() { return cb(null, true); });
}

/*
* Each function simulate iterating through array of results
* @args: may contain "start" and "end" properties containing array index values as a range
* @iterator: function to be passed to Array#forEach as an iterator
* @cb: callback to pass error
*/

//TODO: convert from slicing based on array index to using ids similar RedisStore
Store.prototype.each = function(args, iterator, cb) {
	var start, end, _this = this;

	if (typeof args === 'function') {
		cb = iterator;
		iterator = args;
		args = {};
	}
	start = args.start || 0;
	end = args.end || _this._store.length;

	process.nextTick(function() {
		_store = _this._store[_this._key].slice(start, end);

		_store.forEach(iterator);

		return cb(null);
	});
}

/*
* Size function returns the size of the datastore
* @cb: callback to pass error and store length
*/
Store.prototype.size = function() {
	return this._store[this._key].length;
}

Store.prototype.reset = function() {
	this._store[this._key] = [];
	return this;
}