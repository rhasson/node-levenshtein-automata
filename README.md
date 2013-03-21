#node-levenshtein-automata
##Levenshtein Automata module for Nodejs based on Dylon Edwards great implementation

Based on the [dylon](https://github.com/dylon) implementation of [Levenshtein Automata](https://github.com/dylon/levenshtein_automata), a nodejs module wrapper that attempts to simplify the use of this algorithm for automating fuzzy text search.

Installation:

```javascript
npm install node-levenshtein-automata
```

###Instantiating the module:
There are four possible arguments that could be passed into the constructor as defaults.
1. algorithm: standard, transposition, or merge_and_split
2. distance: a numberical value as default for maximum edit distance
3. sort:
  - sort_matches: true/false of whether to sort.  Sorting is done first according to the transduced terms' Levenshtein distances from the query term, then lexicographically, in a case insensitive manner
  - include_distance: true/false of whether to include the levenshtein distance with the result
  - case_insensitive: true/false of whether to sort in a case insensitive manner 
4. store: currently only supporting memory but in the future will support leveldb and redis

```javascript
var lev = require('node-levenshtein-automata');

var idx = new lev({algorithm: 'transposition', distance: 2})
```

###Indexing
Text input may be in the form of a string, array of strings or array of objects containing a "text" field with the string to parse and a "distance" field which would be the max edit distance.  If no distance is provided the default value of 2 will be used or the value which was passed to the constructor.

var doc = [
	{text: "some string to index", distance: 2},
	{text: "I love surfing videos on @youtube", distance: 2},
	{text: "https://github.com/rhasson is pretty cool too", distance: 2}
]

var doc2 = [
	"some string to index",
	"I love surfing videos on @youtube",
	"https://github.com/rhasson is pretty cool too"
]

idx.index(doc);

idx.index('this is another test string');
```

###Searching
Search can be done by simply passing in the query term and optionally passing in the max edit distance for the particular query.  If not passed in the default provided in the constructor will be used.  Lastly a callback must be provided which will receive error and data arguments.
The data parameter may be an emptry array if no match was found or an array containing one or more arrays with the term and its levenshtein distance

```javascript
idx.search('youtube', 2, function(err, data) {
	console.log(data)  // [ ['youtube', 0] ]
});

idx.search('youtube', onResponse);
```

###For more information about the details behind Levenshtein Automata and how this module implements it visit dylon's [Levenshtein Automata](https://github.com/dylon/levenshtein_automata) Github page.