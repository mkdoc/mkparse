/**
 *  Creates an array of language rules for actionscript files.
 *
 *  Recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  See the [c language](#c).
 *
 *  @function actionscript
 *  @param {Object} [opts] processing options.
 *
 *  @returns list of language rules.
 */
module.exports = require('./c');
