var lang = require('./index.js');

/**
 *  Creates an array of language rules for SGML/XML processing instructions.
 *
 *  Recognises multi-line comments started with `<?` and terminated 
 *  with `?>`.
 *
 *  @function pi
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function pi(opts) {
  opts = opts || {};
  opts.start = /<\?/;
  opts.end = /\?>/;
  opts.lead = false;
  return [lang.multi(opts)];
}

module.exports = pi;
