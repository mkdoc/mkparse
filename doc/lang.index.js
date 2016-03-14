/**
 *  Contains utilities for testing whether a language id is valid, loading 
 *  language packs and finding language identifiers by file extension.
 *
 *  @module language
 *
 *  @require mkparse/lang
 *  @input doc/languages.js
 *  @output lang/index.js
 *  @build node doc/languages.js
 */
var map = {};

/**
 *  Find a language pack identifier by file extension.
 *
 *  File extensions must *not* include the leading period.
 *
 *  @function find
 *  @param {String} ext file extension.
 *
 *  @returns language pack identifier if found.
 */
function find(extension) {
  for(var k in map) {
    if(~map[k].ext.indexOf(extension)) {
      return k; 
    } 
  }
}

/**
 *  Test whether a language exists by identifier.
 *
 *  @function exists
 *  @param {String} id language pack identifier.
 *
 *  @returns whether the language pack exists.
 */
function exists(id) {
  return Boolean(map[id]);
}

/**
 *  Load a language pack by identifier.
 *
 *  @function load
 *  @param {String} id language pack identifier.
 *
 *  @throws Error if the language pack does not exist.
 */
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
  exists: exists,
  load: load,
  find: find
}
