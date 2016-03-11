/**
 *  Creates an array of language rules for markdown files.
 *
 *  Recognises multi-line comments started with `<!--` and terminated 
 *  with `-->`.
 *
 *  See the [html language](#html).
 *
 *  @function markdown
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('./html');
