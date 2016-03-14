var lang = require('../lib/rule')
  , css = require('./css');

/**
 *  Creates an array of language rules for stylus files.
 *
 *  Recognises terminated multi-line comments starting with `/*` and 
 *  buffered multi-line blocks starting with `/*!` as well as 
 *  continuous blocks of single-line comments beginning with `//`.
 *
 *  See the [css language](#css).
 *
 *  @function stylus
 *  @param {Object} [opts] processing options.
 *
 *  @option {Object|Boolean=true} single single-line comment options.
 *  @option {Object|Boolean=true} multi multi-line comment options.
 *  @option {Object|Boolean=true} buffer buffer comment options.
 *
 *  @returns list of language rules.
 */
function stylus(opts) {
  opts = opts || {};

  // enable buffer comments
  opts.buffer = opts.buffer !== undefined ? opts.buffer : {};
  opts.buffer.start = opts.buffer.start || /\/\*!/;

  // enable single line comments
  opts.single = opts.single !== undefined ? opts.single : {};
  var set = css(opts);

  if(opts.buffer) {
    set.unshift(lang.multi(opts.buffer)); 
  }

  return set;
}
module.exports = stylus;
