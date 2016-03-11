var lang = require('./index');

/**
 *  Creates an array of language rules for C files.
 *
 *  Recognises terminated multi-line comments starting with `/**`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function c
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function c(opts) {
  return [lang.multi(opts)];
}

module.exports = c;
