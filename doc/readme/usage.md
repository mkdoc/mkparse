## Usage

Parse a string or buffer:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
}
```

Load and parse file contents:

```javascript
var cparse = require('cparse')
  , stream = cparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
}
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var cparse = require('cparse')
  , fs = require('fs')
  , stream = cparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```
