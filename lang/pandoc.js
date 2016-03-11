var lang = require('./index.js')
  , html = require('./html');

/**
 *  Creates an array of language rules for pandoc files.
 *
 *  Recognises multi-line comments starting with `<!--` or `<!---` and 
 *  terminated with `-->`, extends the [html language](#html).
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
  // longer pattern should come first
  return [lang.multi(opts)].concat(html());
}

module.exports = pandoc;
