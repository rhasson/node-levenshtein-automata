var s = require('../index');
var lev = new s();

var d,d1;

var doc = ['this is a @vimeo test','another youtube test', 'http://vimeo.com/asfgaa', 'some other crap I dont care about'];
var doc2 = ['philly is a great city to vist', 'one of the nicest cities in the country', 'great tech scene too on vimeo'];

lev
  .index(doc, 111)
  .index(doc2, 222)

  .search('vimeo', function(e,r){
	console.log(r);
  })

  .search('city', function(e,r){
	console.log(r);
  });