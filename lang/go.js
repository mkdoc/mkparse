/**
 *  Creates an array of language rules for go files.
 *
 *  Recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function go
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('../lib/rule');
