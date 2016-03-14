// automatically generated on Mon Mar 14 2016 11:55:34 GMT+0800 (WITA) (node doc/languages.js)
var map = {
  'actionscript': {name: "actionscript.js", ext: ["as"]},
  'c': {name: "c.js", ext: []},
  'coffeescript': {name: "coffeescript.js", ext: []},
  'conf': {name: "conf.js", ext: []},
  'cpp': {name: "cpp.js", ext: []},
  'css': {name: "css.js", ext: []},
  'erlang': {name: "erlang.js", ext: []},
  'go': {name: "go.js", ext: []},
  'groovy': {name: "groovy.js", ext: []},
  'html': {name: "html.js", ext: []},
  'ini': {name: "ini.js", ext: []},
  'jade': {name: "jade.js", ext: []},
  'java': {name: "java.js", ext: []},
  'javascript': {name: "javascript.js", ext: []},
  'less': {name: "less.js", ext: []},
  'markdown': {name: "markdown.js", ext: []},
  'pandoc': {name: "pandoc.js", ext: []},
  'php': {name: "php.js", ext: []},
  'pi': {name: "pi.js", ext: []},
  'processing': {name: "processing.js", ext: []},
  'properties': {name: "properties.js", ext: []},
  'python': {name: "python.js", ext: []},
  'ruby': {name: "ruby.js", ext: []},
  'sass': {name: "sass.js", ext: []},
  'scala': {name: "scala.js", ext: []},
  'shell': {name: "shell.js", ext: []},
  'sql': {name: "sql.js", ext: []},
  'stylus': {name: "stylus.js", ext: []},
  'toml': {name: "toml.js", ext: []},
  'typescript': {name: "typescript.js", ext: []},
  'vim': {name: "vim.js", ext: []},
  'xml': {name: "xml.js", ext: []},
  'yaml': {name: "yaml.js", ext: []}
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

module.exports = {
 map: map,
 exists: exists,
 load: load
};
