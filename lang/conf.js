/**
 *  Creates an array of language rules for conf files.
 *
 *  Recognises continuous blocks of lines beginning with `#`.
 *
 *  See the [shell language](#shell).
 *
 *  @function conf
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('./shell');
