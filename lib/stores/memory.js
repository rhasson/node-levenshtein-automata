/*
* Memory store v.0.0.1
*
*
*/

function MemoryStore () {
	this._indexname = 'searchindex:';
	this._store = {};
}

module.exports = MemoryStore;

MemoryStore.prototype.init = function(name) {
	var n = this._indexname+name;
	if (Object.keys(this._store).indexOf(n) === -1) this._store[n] = [];

	return this;
}

MemoryStore.prototype.get = function(name, id) {
	var ary, n = this._indexname+name;

	ary = this._store[n].filter(function(v) {
		return id === v.id
	});
	return ary;
}

MemoryStore.prototype.set = function(name, obj) {
	var n = this._indexname+name;
	this._store[n].push(obj);
}

MemoryStore.prototype.each = function(name, start, fn) {
	var n = this._indexname+name;

	if (typeof start === 'function') {
		fn = start;
		start = 0;
	}
	_store = start ? this._store[n] : this._store[n].slice(start);

	_store.forEach(fn);
}

MemoryStore.prototype.size = function(name) {
	return this._store[this._indexname+name].length;
}

MemoryStore.prototype.reset = function(name) {
	this._store[this._indexname+name] = [];
	return this;
}