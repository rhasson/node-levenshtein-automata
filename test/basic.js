var s = require('../index');
var l = new s();

var d,d1;

var doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about'];
var doc2 = ['philly is a great city to vist', 'one of the nicest cities in the country', 'great tech scene too on vimeo'];

l.index(doc, 111);
l.index(doc2, 222);

l.search('vimeo', function(e,r){
	console.log(r);
});

l.search('city', function(e,r){
	console.log(r);
});