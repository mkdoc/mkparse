var parser = require('./index')
  , stream = parser.file('test/fixtures/singleline-multi-tags.js');

stream.on('comment', function(comment) {
  console.dir(comment)
});
