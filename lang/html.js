// @extensions htm html html5

var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for HTML files.
 *
 *  Recognises multi-line comments started with `<!--` and terminated 
 *  with `-->`.
 *
 *  @function html
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function html(opts) {
  opts = opts || {};
  opts.start = /<!--/;
  opts.end = /-->/;
  opts.lead = false;
  return [lang.multi(opts)];
}

module.exports = html;
