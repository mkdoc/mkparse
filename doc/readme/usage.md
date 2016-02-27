## Usage

```javascript
var cparse = require('cparse')
  , stream = cparse.file('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
}
```
