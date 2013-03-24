var s = require('../index')
	, store = require('../lib/stores/memory')
	, lev = new s({store: new store()})
	, d
	, d1
	, doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about']
	, doc2 = ['philly is a great city to vist', 'one of the nicest cities in the country', 'great tech scene too on vimeo']
	, idx1
	, idx2;

idx1 = lev.createIndex('test');
idx2 = lev.createIndex('test2');

console.log(idx1)

idx1
  .index(doc, 111)
  .index(doc2, 222)

  .search('vimeo', function(e,r){
	console.log('idx1: ', r);
  })

  .search('city', function(e,r){
	console.log('idx1: ', r);
  });

idx2
	.index(doc, 333)

	.search('video', function(e,r) {
		console.log('idx2: ', r);
	});

console.log(idx1)