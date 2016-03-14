// @extensions css

var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for css files.
 *
 *  Recognises terminated multi-line comments starting with `/*`.
 *
 *  See the [c language](#c).
 *
 *  @function css
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function css(opts) {
  opts = opts || {};
  opts.multi = opts.multi || {};

  // disable by default so this can be shared
  // with pre-processors that also accept single-line comments
  if(opts.single === undefined) {
    opts.single = false;
  }

  if(opts.multi.greedy === undefined) {
    opts.multi.greedy = true; 
  }

  return lang(opts);
}
module.exports = css;
