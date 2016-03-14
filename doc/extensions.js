var file = process.argv[2]
  , mkparse = require('../index')
  , extensions = []
  , complete = function() {
      process.stdout.write(JSON.stringify(extensions)); 
    }
  , stream = mkparse.load(file, complete);

stream.on('comment', function(comment) {
  comment.tags.forEach(function(tag) {
    if(tag.id === 'extensions') {
      var exts =
        (tag.name + (tag.description ? ' ' + tag.description : ''))
          .split(/\s+/);
      extensions = extensions.concat(exts);
    } 
  })
});
