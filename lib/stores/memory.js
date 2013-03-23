/*
* Memory store v.0.0.1
*
*
*/

function MemoryStore () {
	this._store = [];
}

module.exports = new MemoryStore();

MemoryStore.prototype.get = function(id) {
	var ary;

	ary = this._store.filter(function(v) {
		return id === v.id
	});
	return ary;
}

MemoryStore.prototype.set = function(obj) {
	this._store.push(obj);
}

MemoryStore.prototype.each = function(start, fn) {
	if (typeof start === 'function') {
		fn = start;
		start = 0;
	}
	_store = start ? this._store : this._store.slice(start);

	_store.forEach(fn);
}

MemoryStore.prototype.size = function() {
	return this._store.length;
}

MemoryStore.prototype.close = function() {
	this_store = [];
	return;
}