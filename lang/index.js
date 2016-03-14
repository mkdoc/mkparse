// automatically generated on Mon Mar 14 2016 11:15:15 GMT+0800 (WITA) (node doc/languages.js)
var map = {
  'actionscript': 'actionscript.js',
  'c': 'c.js',
  'coffeescript': 'coffeescript.js',
  'conf': 'conf.js',
  'cpp': 'cpp.js',
  'css': 'css.js',
  'erlang': 'erlang.js',
  'go': 'go.js',
  'groovy': 'groovy.js',
  'html': 'html.js',
  'ini': 'ini.js',
  'jade': 'jade.js',
  'java': 'java.js',
  'javascript': 'javascript.js',
  'less': 'less.js',
  'markdown': 'markdown.js',
  'pandoc': 'pandoc.js',
  'php': 'php.js',
  'pi': 'pi.js',
  'processing': 'processing.js',
  'properties': 'properties.js',
  'python': 'python.js',
  'ruby': 'ruby.js',
  'sass': 'sass.js',
  'scala': 'scala.js',
  'shell': 'shell.js',
  'sql': 'sql.js',
  'stylus': 'stylus.js',
  'toml': 'toml.js',
  'typescript': 'typescript.js',
  'vim': 'vim.js',
  'xml': 'xml.js',
  'yaml': 'yaml.js'
};

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

module.exports = {
 map: map,
 exists: exists,
 load: load
};
