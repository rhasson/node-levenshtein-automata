var s = require('../index')
	, RedisStore = s.RedisStore()
	, store = new RedisStore
	, idx;

var d,d1,m,m1;

var doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about'];
var query = ['vimeo test', 'vimeo', 'video', 'http://youtube.com', 'fun', 'care'];
var query2 = ['v', 'vi', 'vim', 'vimeo'];

console.log('Start indexing');
m = process.memoryUsage().heapUsed;
d = new Date().getTime();

idx = s.createIndex('test', {store: store});

for (var i=0; i < 1000; i++) {
	idx.index(doc, i);
}

d1 = new Date().getTime();
m1 = process.memoryUsage().heapUsed;
console.log('End indexing - ', (d1 - d) / 1000, ' sec', '  memory used: ', m1-m);

console.log('Start searching');
m = process.memoryUsage().heapUsed;
d = new Date().getTime();

for (var i=0; i < 1000; i++) {
	query.forEach(function(q) {
		idx.search(q, function(e,r){});
	});
}

d1 = new Date().getTime();
m1 = process.memoryUsage().heapUsed;
console.log('End searching - ', (d1 - d) / 1000, ' sec', '  memory used: ', m1-m);
