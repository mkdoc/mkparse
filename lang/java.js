/**
 *  Creates an array of language rules for java files.
 *
 *  Recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function java
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('../lib/rule');
