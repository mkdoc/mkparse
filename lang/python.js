// @extensions py

var lang = require('../lib/rule')
  , shell = require('./shell');

/**
 *  Creates an array of language rules for python files.
 *
 *  Recognises continuous blocks of lines beginning with `#` and multi-line 
 *  comments delimited with `"""`.
 *
 *  @function python
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function python(opts) {
  opts = opts || {};
  opts.multi = opts.multi || {};
  // must use global flag with start and end the same
  // so that the close() function can use lastIndex 
  opts.multi.start = opts.multi.end = /"""/g;
  opts.multi.lead = /^\s*"+([^"]*)/;
  return shell(opts.single).concat(lang.multi(opts.multi));
}

module.exports = python;
