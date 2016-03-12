var lang = require('./css');

/**
 *  Creates an array of language rules for sass files.
 *
 *  Recognises terminated multi-line comments starting with `/*` and 
 *  continuous blocks of single-line comments beginning with `//`.
 *
 *  See the [css language](#css).
 *
 *  @function sass
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function sass(opts) {
  opts = opts || {};
  // enable single line comments
  opts.single = {};
  return lang(opts);
}
module.exports = sass;
