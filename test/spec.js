var parser = require('../index')
  , stream = parser.file(
    process.argv[2]);

stream.on('comment', function(comment) {
  //console.log(JSON.stringify(comment, undefined, 2));
  console.dir(comment)
});
