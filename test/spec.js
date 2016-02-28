var parser = require('../index')
  , stream = parser.file('test/fixtures/multiline-compact.js');

stream.on('comment', function(comment) {
  console.dir(comment)
});
