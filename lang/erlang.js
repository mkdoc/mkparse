var lang = require('./index.js');

/**
 *  Creates an array of language rules for erlang files.
 *
 *  Recognises continuous blocks of lines beginning with `%`.
 *
 *  @function erlang
 *  @param {Object} [opts] processing options.
 *
 *  @option {RegExp} mark sub pattern.
 *  @option {RegExp} trail pattern to strip trailing meta characters.
 *
 *  @returns list of language rules.
 */
function erlang(opts) {
  opts = opts || {};
  opts.mark = opts.mark ? opts.mark : /%+/;
  opts.trail = opts.trail instanceof RegExp
    ? opts.trail: new RegExp('\\s*' + opts.mark.source + '.*$');
  // single rule style for this language pack
  return [lang.single(opts)];
}

module.exports = erlang;
