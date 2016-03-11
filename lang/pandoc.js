var lang = require('./index.js');

/**
 *  Creates an array of language rules for pandoc files.
 *
 *  Recognises multi-line comments started with `<!---` and terminated 
 *  with `-->`.
 *
 *  See the [pandoc website](http://pandoc.org).
 *
 *  @function pandoc
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function pandoc(opts) {
  opts = opts || {};
  opts.start = /<!---/;
  opts.end = /-->/;
  opts.lead = false;
  return [lang.multi(opts)];
}

module.exports = pandoc;
