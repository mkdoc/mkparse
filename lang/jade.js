// @extensions jade

var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for jade files.
 *
 *  Recognises continuous blocks starting with `//-` or `//`.
 *
 *  @function jade
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function jade(opts) {
  opts = opts || {};
  opts.mark = /\/\/-/;
  // longer pattern should come first
  return [lang.single(opts), lang.single(opts.single)];
}

module.exports = jade;
