#node-levenshtein-automata
##Levenshtein Automata module for Nodejs based on Dylon Edwards great implementation

Based on the [dylon](https://github.com/dylon) implementation of [Levenshtein Automata](https://github.com/dylon/levenshtein_automata), a nodejs module wrapper that attempts to simplify the use of this algorithm for automating fuzzy text search.

Installation:

```javascript
npm install node-levenshtein-automata
```

###Instantiating the module:
When requiring the module a simple Factory Function will be returned allowing you to create
a basic memory store and an index which will be used for loading text and searching.
When creating the index there are several possible arguments that could be passed into the constructor.

- algorithm: standard, transposition, or merge_and_split
- distance: a numberical value as default for maximum edit distance, otherwise 1 is the default
- sort_matches: true/false of whether to sort.  Sorting is done first according to the transduced terms' Levenshtein distances from the query term, then lexicographically, in a case insensitive manner
- include_distance: true/false of whether to include the levenshtein distance with the result
- case_insensitive: true/false of whether to sort in a case insensitive manner 
- store: currently supporting memory and redis stores with leveldb in the works

```javascript
var lev = require('node-levenshtein-automata')
	, memStore = lev.MemoryStore()
	, idx = lev.createIndex('twits', {store: memStore});
```
Creating a memory store as shown above will keep all indexes together in the same object.
This requires that all index names (first argument to createIndex) are unique.
If that is not desireable, simply omitting the "store" argument to createIndex will create
a separate memory store per index.

Note: this is only applicable to MemoryStore

```javascript
var idx = lev.createIndex('twits');
```

###Redis Store
Redis may be used as the backing store for indexing and searching.  Using RedisStore is simple:

```javascript
var lev = require('node-levenshtein-automata')
	, RedisStore = lev.RedisStore()
	, store = new RedisStore(args)  //args are redis specific arguments
	, idx = lev.createIndex('twits', {store: store});
```

###Indexing
Text input may be in the form of a string or array of strings.  The second argument is an id.  It can be integer or string.

```javascript

var doc = [
	"some string to index",
	"I love surfing videos on @youtube",
	"https://github.com/rhasson is pretty cool too"
]

idx.index(doc, 111);
idx.index('this is another test string', "222333");
```

###Searching
Search can be done by simply passing in the query term and optionally passing in the max edit distance for the particular query.  Otherwise the default provided in the constructor will be used.  Lastly a callback must be provided which will receive error and data arguments.
The data parameter may be an emptry array if no match was found or an array containing the id, one or more arrays with the term and its levenshtein distance, total count of matches, and the initial query term.

```javascript
idx.search('youtube', 2, function(err, data) {
	console.log(data)  // {id: 111, terms: [ ['youtube', 0] ], count: 1, query: 'youtube'}
});

idx.search('youtube videos', onResponse);
```

For more information about the details behind Levenshtein Automata and how this module implements it visit dylon's [Levenshtein Automata](https://github.com/dylon/levenshtein_automata) Github page.