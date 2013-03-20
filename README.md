#node-levenshtein-automata
## Levenshtein Automata module for Nodejs based on Dylon Edwards great implementation

Based on the dylon (https://github.com/dylon) implementation of Levenshtein Automata, a nodejs module wrapper that attempts to simplify the use of this algorithm for automating fuzzy text search.

Installation:

```javascript
npm install node-levenshtein-automata
```

Basic usage:

```javascript
var lev = require('node-levenshtein-automata');

var idx = new lev({algorithm: 'transposition'})

var doc = [
	{text: "some string to index", distance: 2},
	{text: "I love surfing videos on @youtube", distance: 2},
	{text: "https://github.com/rhasson is pretty cool too", distance: 2}
]

idx.index(doc);

