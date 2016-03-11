var lang = require('./index.js');

/**
 *  Creates an array of language rules for coffeescript files.
 *
 *  Recognises continuous blocks of lines beginning with `#` and multi-line 
 *  comments delimited with `###`.
 *
 *  @function coffeescript
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
function coffeescript(opts) {
  opts = opts || {};
  opts.single = opts.single || {};
  opts.multi = opts.multi || {};
  opts.single.mark = opts.single.mark ? opts.single.mark : /#+/;
  opts.single.trail = opts.single.trail instanceof RegExp
    ? opts.single.trail: new RegExp('\\s*' + opts.single.mark.source + '.*$');

  // must use global flag with start and end the same
  // so that the close() function can use lastIndex 
  opts.multi.start = opts.multi.end = /###/g;
  opts.multi.lead = /^\s*#+([^#]*)/;

  return [lang.multi(opts.multi), lang.single(opts.single)];
}

module.exports = coffeescript;
