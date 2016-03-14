var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for erlang files.
 *
 *  Recognises continuous blocks of lines beginning with `%`.
 *
 *  @function erlang
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function erlang(opts) {
  opts = opts || {};
  opts.mark = /%+/;
  opts.trail = new RegExp('\\s*' + opts.mark.source + '.*$');
  // single rule style for this language pack
  return [lang.single(opts)];
}

module.exports = erlang;
