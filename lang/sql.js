var lang = require('../lib/rule');

/**
 *  Creates an array of language rules for SQL statements.
 *
 *  Recognises terminated multi-line comments started with `/*` and 
 *  continuous lines beginning with `--`.
 *
 *  If the `mysql` option is given continuous lines beginning with `#` are 
 *  also recognised.
 *
 *  @function sql
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean} include mysql specific comment rule.
 *
 *  @returns list of language rules.
 */
function sql(opts) {
  opts = opts || {};
  opts.mark = /--/;
  var set = opts.mysql ? require('./shell')() : [];
  set = set.concat([lang.single(opts), lang.multi({greedy: true})]);
  return set;
}

module.exports = sql;
