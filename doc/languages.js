var fs = require('fs')
  , util = require('util')
  , execSync = require('child_process').execSync
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

var contents = fs.readdirSync(dir);

println('// automatically generated on '
  + new Date() + ' (node doc/languages.js)');
// print id to require path map
println('var map = {');
contents.forEach(function(name, index) {
  var i, excluded, id, exts;

  for(i = 0;i < excludes.length;i++) {
    if(excludes[i].test(name)) {
      excluded = true;
      break; 
    } 
  }

  if(!excluded) {
    id = name.replace(ext, '');
    exts = '' + execSync('node doc/extensions.js lang/' + name);
    // map key id
    print('  \'%s\': ', id);

    // map value object
    print('{name: "%s", ext: %s}', name, exts);

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
