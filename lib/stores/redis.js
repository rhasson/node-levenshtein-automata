/*
* Redis store v.0.0.1
*
*
*/

redis = require('redis');

/*
* RedisStore constuctor
* @args: redis specific arguments
*/
function RedisStore (args) {
	args = (typeof args === 'object') ? args : {};
	this._indexname = args.index_name || 'searchindex:';
	this._client = redis.createClient(
		args.port || 6379,
		args.host || '127.0.0.1',
		args.options || null);
}

module.exports = RedisStore;

/*
* Init function that must be called before any further access.  Typically called by createIndex
* @name: index name to be used
* returns: a new Store object with the current redis client instance and given index name
*/
RedisStore.prototype.init = function(name) {
	return new Store({client: this._client, key: this._indexname+name});
}

/*
* Main Store constructor
* @args: redis client object, index key (aka name)
*/
function Store (args) {
	this._store = args.client;
	this._key = args.key;
}

/*
* Get function to retreive data based on id used during indexing
* @id: id of the data used when it was indexed
* @cb: callback returned with error and array of entries
*/
Store.prototype.get = function(id, cb) {
	var ary;

	this._store.zrangebyscore(this._key, id, id, function(err, resp) {
		console.log(err, resp)
		if (!err && resp) {
			resp = '['+resp.toString()+']';
			try { ary = JSON.parse(resp); }
			catch(e) { return cb(e); }

			return cb(null, ary);
		} else return cb(new Error(err));
	});
}

/*
* Set function to save an object containing data and id. Id property must be set on object
* @obj: object to save.  If property must be set and reflect the id lookup the data later
* @cb: callback
*/
Store.prototype.set = function(obj, cb) {
	this._store.zadd(this._key, obj.id, JSON.stringify(obj), cb);
}

/*
* Each function simulate iterating through array of results
* @args: may contain "start" and "end" properties containing id values as a range
* @iterator: function to be passed to Array#forEach as an iterator
* @cb: callback to pass error
*/
Store.prototype.each = function(args, iterator, cb) {
	var start, end;

	if (typeof args === 'function') {
		cb = iterator;
		iterator = args;
		args = {};
	}
	start = args.start || '-inf';
	end = args.end || '+inf';

	this._store.zrangebyscore(this._key, start, end, function(err, resp) {
		var ary, d;

		if (!err) {
			ary = '[' + resp.toString() + ']';
			try { d = JSON.parse(ary); }
			catch(e) { return cb(e); }

			d.forEach(iterator);

			return cb(err);
		}
	});
}

/*
* Size function returns the size of the datastore
* @cb: callback to pass error and store length
*/
Store.prototype.size = function(cb) {
	this._store.zcard(this._key, function(err, resp) {
		if (!err) return cb(null, resp);
		else return cb(err);
	});
}

Store.prototype.reset = function() {
	return this;
}