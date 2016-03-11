/**
 *  Creates an array of language rules for groovy files.
 *
 *  Recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function groovy
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('./index.js');
