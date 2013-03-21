var s = require('../index');
var l = new s();

var d,d1;

var doc = ['this is a test','another youtube test', 'maybe a vimeo video for fun', 'some other crap I dont care about'];
var query = ['test', 'vimeo', 'video', 'youtube', 'fun', 'care'];
var query2 = ['v', 'vi', 'vim', 'vimeo'];

console.log('Start indexing');
d = new Date().getTime();

for (var i=0; i < 100000; i++) {
	l.index(doc, i);
}

d1 = new Date().getTime();
console.log('End indexing - ', (d1 - d) / 1000, ' sec', '  index size: ', l._store.length);

console.log('Start searching');
d = new Date().getTime();

for (var i=0; i < 10000; i++) {
	query.forEach(function(q) {
		l.search(q, function(){});
	});
}

d1 = new Date().getTime();
console.log('End searching - ', (d1 - d) / 1000, ' sec');

process.exit(1);