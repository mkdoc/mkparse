var parser = require('../index')
  , stream = parser.load(process.argv[2], {dotted: true});

stream.on('comment', function(comment) {
  if(~process.argv.indexOf('--json')) {
    console.log(JSON.stringify(comment, undefined, 2));
  }else{
    console.dir(comment)
  }
});
