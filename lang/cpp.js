/**
 *  Creates an array of language rules for C++ files.
 *
 *  Recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  See the [default settings](#defaults).
 *
 *  @function cpp
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean} greedy include `/*` comments.
 *
 *  @returns list of language rules.
 */
module.exports = require('./index.js');
