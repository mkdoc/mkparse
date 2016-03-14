var fs = require('fs')
  , util = require('util')
  , map = {}
  , methods = require('./lang.index.js')
  , dir = 'lang'
  , excludes = [/^index\.js$/, /\.doc.js$/]
  , ext = /\.js$/;

function getExtensions(file, cb) {
  var mkparse = require('../index')
    , extensions = []
    , complete = function() {
        cb(extensions);
      }
    , stream = mkparse.load('lang/' + file, complete);

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
}

function println() {
  console.log.apply(console, arguments);
}

function print() {
  process.stdout.write(util.format.apply(util, arguments));
}

var contents = fs.readdirSync(dir)
  , files = contents.slice()
  , index = 0;

function header() {
  println('// automatically generated on '
    + new Date() + ' (node doc/languages.js)');
  // print id to item map
  println('var map = {');
}

function body() {
  function next() {
    var name = files.shift();

    if(!name) {
      return footer();
    }

    var i, excluded, id, item;

    for(i = 0;i < excludes.length;i++) {
      if(excludes[i].test(name)) {
        excluded = true;
        break; 
      } 
    }

    if(excluded) { return next(); }

    if(!process.stdout.isTTY) {
      console.error('build: %s', name);
    }

    getExtensions(name, function(exts) {
      id = name.replace(ext, '');

      item = {name: name, ext: exts};

      // map key id
      print('  \'%s\': ', id);

      // map value object
      print('%j', item);
      println(',');

      map[id] = item;

      index++;
      next();
    });
  }

  next();
}

function footer() {
  println('};');

  println();
  println('var ext = {');

  function iterator(ext) {
    // last declared ext will win!
    print('  \'%s\': \'%s\'', ext, k);
    println(',');
  }

  for(var k in map) {
    map[k].ext.forEach(iterator);
  }

  println('};');

  println();
  println(methods.exists.toString());
  println();
  println(methods.load.toString());
  println();
  println(methods.find.toString());
  println();
  println('module.exports = {');
  println(' map: map,');
  println(' ext: ext,');
  println(' find: find,');
  println(' exists: exists,');
  println(' load: load');
  println('};');
}

header();
body();
