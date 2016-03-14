var fs = require('fs')
  , util = require('util')
  // prevent jshint error
  , map = {}
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

function exists(id) {
  return Boolean(map[id]);
}

function load(id) {
  // only try to load known languages
  // consumer should use exists() first
  if(exists(id)) {
    var info = map[id];
    return require('./' + info.name); 
  }
  throw new Error('cannot load unknown language pack: ' + id);
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

println('// automatically generated on '
  + new Date() + ' (node doc/languages.js)');
// print id to require path map
println('var map = {');

function next() {
  var name = files.shift();

  if(!name) {
    return complete();
  }

  var i, excluded, id;

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

    // map key id
    print('  \'%s\': ', id);

    // map value object
    print('{name: "%s", ext: %j}', name, exts);

    if(index < contents.length - 1) {
      println(',');
    }else{
      println();
    }

    index++;
    next();
  });
}

next();

function complete() {
  println('};');
  println();
  println(exists.toString());
  println();
  println(load.toString());
  println();
  println('module.exports = {');
  println(' map: map,');
  println(' exists: exists,');
  println(' load: load');
  println('};');
}
