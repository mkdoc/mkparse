var lang = require('./css');

/**
 *  Creates an array of language rules for less files.
 *
 *  Recognises terminated multi-line comments starting with `/*` and 
 *  continuous blocks of single-line comments beginning with `//`.
 *
 *  See the [css language](#css).
 *
 *  @function less
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function less(opts) {
  opts = opts || {};
  // enable single line comments
  opts.single = opts.single !== undefined ? opts.single : {};
  return lang(opts);
}
module.exports = less;
