var fs = require('fs')
  , path = require('path')
  , util = require('util')
  // prevent jshint error
  , map = {}
  , dir = 'lang'
  , excludes = [/^index\.js$/, /\.doc.js$/]
  , ext = /\.js$/;

function exists(id) {
  return Boolean(map[id]);
}

function load(id) {
  // only try to load known languages
  // consumer should use exists() first
  if(exists(id)) {
    return require('./' + id); 
  }
  throw new Error('cannot load unknown language pack: ' + id);
}

function println() {
  console.log.apply(console, arguments);
}

function print() {
  process.stdout.write(util.format.apply(util, arguments));
}

var contents = fs.readdirSync(dir);

println('// automatically generated on '
  + new Date() + ' (node doc/languages.js)');
// print id to require path map
println('var map = {');
contents.forEach(function(name, index) {
  var i, excluded, id, file;

  for(i = 0;i < excludes.length;i++) {
    if(excludes[i].test(name)) {
      excluded = true;
      break; 
    } 
  }

  if(!excluded) {
    id = name.replace(ext, '');
    file = dir + path.sep + name;

    // map key id
    print('  \'%s\': ', id);

    // map value object
    print('\'%s\'', name);

    if(index < contents.length - 1) {
      println(',');
    }else{
      println();
    }

  }
});
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
