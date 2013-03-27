var lev = require('../index')
	, RedisStore = lev.RedisStore()
	, s = new RedisStore()
	, store
	, d, d1, doc , doc2, idx1, idx2;

doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about'];

store = s.init('testing');

doc.forEach(function(v) {
	store.set({text: v, id: '1111'});
});

store.get('1111', function(e, r) {
	console.log('ERROR: ', e);
	console.log('RESPONSE: ', r);
});