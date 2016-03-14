// @extensions xml xhtml xsl

/**
 *  Creates an array of language rules for XML files.
 *
 *  Recognises multi-line comments started with `<!--` and terminated 
 *  with `-->`.
 *
 *  See the [html language](#html).
 *
 *  @function xml
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('./html');
