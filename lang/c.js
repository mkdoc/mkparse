var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for C files.
 *
 *  Recognises terminated multi-line comments starting with `/*`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function c
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean=true} greedy disable to use `/**` comments only.
 *
 *  @returns list of language rules.
 */
function c(opts) {
  opts = opts || {};
  if(opts.greedy === undefined) {
    opts.greedy = true; 
  }
  return [lang.multi(opts)];
}

module.exports = c;
