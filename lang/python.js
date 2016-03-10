var lang = require('./c')
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
  opts.multiple = opts.multiple || {};
  opts.multiple.start = opts.multiple.end = '"""';
  return [shell(opts.single), lang.multiple(opts.multiple)];
}

module.exports = python;
