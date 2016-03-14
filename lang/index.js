// automatically generated on Mon Mar 14 2016 13:11:43 GMT+0800 (WITA) (node doc/languages.js)
var map = {
  'actionscript': {"name":"actionscript.js","ext":["as"]},
  'c': {"name":"c.js","ext":["c","h"]},
  'coffeescript': {"name":"coffeescript.js","ext":["coffee"]},
  'conf': {"name":"conf.js","ext":["conf"]},
  'cpp': {"name":"cpp.js","ext":["cpp"]},
  'css': {"name":"css.js","ext":["css"]},
  'erlang': {"name":"erlang.js","ext":["erl","beam"]},
  'go': {"name":"go.js","ext":["go"]},
  'groovy': {"name":"groovy.js","ext":["groovy"]},
  'html': {"name":"html.js","ext":["htm","html","html5"]},
  'ini': {"name":"ini.js","ext":["ini"]},
  'jade': {"name":"jade.js","ext":["jade"]},
  'java': {"name":"java.js","ext":["java"]},
  'javascript': {"name":"javascript.js","ext":["js"]},
  'less': {"name":"less.js","ext":["less"]},
  'markdown': {"name":"markdown.js","ext":["md","markdown"]},
  'pandoc': {"name":"pandoc.js","ext":[]},
  'php': {"name":"php.js","ext":["php","phps"]},
  'pi': {"name":"pi.js","ext":[]},
  'processing': {"name":"processing.js","ext":[]},
  'properties': {"name":"properties.js","ext":["properties"]},
  'python': {"name":"python.js","ext":["py"]},
  'ruby': {"name":"ruby.js","ext":["rb"]},
  'sass': {"name":"sass.js","ext":["sass"]},
  'scala': {"name":"scala.js","ext":["scala"]},
  'shell': {"name":"shell.js","ext":["sh","zsh","bash"]},
  'sql': {"name":"sql.js","ext":["sql"]},
  'stylus': {"name":"stylus.js","ext":["styl"]},
  'toml': {"name":"toml.js","ext":["toml"]},
  'typescript': {"name":"typescript.js","ext":["ts"]},
  'vim': {"name":"vim.js","ext":["vim"]},
  'xml': {"name":"xml.js","ext":["xml","xhtml","xsl"]},
  'yaml': {"name":"yaml.js","ext":["yml"]},
};

var ext = {
  'as': 'actionscript',
  'c': 'c',
  'h': 'c',
  'coffee': 'coffeescript',
  'conf': 'conf',
  'cpp': 'cpp',
  'css': 'css',
  'erl': 'erlang',
  'beam': 'erlang',
  'go': 'go',
  'groovy': 'groovy',
  'htm': 'html',
  'html': 'html',
  'html5': 'html',
  'ini': 'ini',
  'jade': 'jade',
  'java': 'java',
  'js': 'javascript',
  'less': 'less',
  'md': 'markdown',
  'markdown': 'markdown',
  'php': 'php',
  'phps': 'php',
  'properties': 'properties',
  'py': 'python',
  'rb': 'ruby',
  'sass': 'sass',
  'scala': 'scala',
  'sh': 'shell',
  'zsh': 'shell',
  'bash': 'shell',
  'sql': 'sql',
  'styl': 'stylus',
  'toml': 'toml',
  'ts': 'typescript',
  'vim': 'vim',
  'xml': 'xml',
  'xhtml': 'xml',
  'xsl': 'xml',
  'yml': 'yaml',
};

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

function find(extension) {
  for(var k in map) {
    if(~map[k].ext.indexOf(extension)) {
      return k; 
    } 
  }
}

module.exports = {
 map: map,
 ext: ext,
 find: find,
 exists: exists,
 load: load
};
