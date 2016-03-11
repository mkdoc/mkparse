var lang = require('./index.js');

/**
 *  Creates an array of language rules for ruby files.
 *
 *  Recognises continuous blocks of lines beginning with `#` 
 *  and `=begin`, `=end` multi-line comments.
 *
 *  @function ruby
 *  @param {Object} [opts] processing options.
 *
 *  @option {Object} multi multi-line rule configuration.
 *  @option {Object} single single-line rule configuration.
 *
 *  @returns list of language rules.
 */
function ruby(opts) {
  opts = opts || {};
  opts.single = opts.single || {};
  opts.multi = opts.multi || {};
  opts.single.mark = opts.single.mark ? opts.single.mark : /#+/;
  opts.single.trail = opts.single.trail instanceof RegExp
    ? opts.single.trail: new RegExp('\\s*' + opts.single.mark.source + '.*$');

  opts.multi.start = /^=begin/;
  opts.multi.end = /^=end/;
  // do not strip intermediate lines
  opts.multi.lead = false;
  // no content on last line
  opts.multi.last = false;

  // single rule style like `shell` and =begin / =end
  return [lang.single(opts.single), lang.multi(opts.multi)];
}

module.exports = ruby;
