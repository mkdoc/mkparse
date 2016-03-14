var fs = require('fs')
  , path = require('path')
  , util = require('util')
  , dir = 'lang'
  , excludes = [/^index\.js$/, /\.doc.js$/]
  , ext = /\.js$/;

function println() {
  console.log.apply(console, arguments);
}

function print() {
  process.stdout.write(util.format.apply(util, arguments));
}

var contents = fs.readdirSync(dir);

println('module.exports = {');
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
    print('\'%s\'', file);

    if(index < contents.length - 1) {
      println(',');
    }else{
      println();
    }

  }
});
println('}');
