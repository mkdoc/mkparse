## Usage

Parse a string or buffer:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var mkparse = require('mkparse')
  , fs = require('fs')
  , stream = mkparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse(
      '# @file spec.rb', {rules: require('mkparse/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('mkparse/lang/ini'), require('mkparse/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

For more detail see the [api docs](/API.md).
