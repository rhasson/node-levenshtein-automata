var lev = require('../index')
	, RedisStore = lev.RedisStore()
	, store = new RedisStore()
	, d, d1, doc , doc2, idx1, idx2;

doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about'];
doc2 = ['philly is a great city to vist', 'one of the nicest cities in the country', 'great tech scene too on vimeo'];

idx1 = lev.createIndex('test', {store: store});
idx2 = lev.createIndex('test2', {store: store});

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
