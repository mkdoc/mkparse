## Usage

Parse a string or buffer:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var cparse = require('cparse')
  , stream = cparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var cparse = require('cparse')
  , fs = require('fs')
  , stream = cparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '# @file spec.rb', {rules: require('cparse/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('cparse/lang/ini'), require('cparse/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```
