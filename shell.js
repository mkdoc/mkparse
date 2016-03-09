var lang = require('./c');

/**
 *  Creates an array of language rules for shell and configuration files.
 *
 *  Recognises continuous blocks of lines beginning with `#`.
 *
 *  @function shell
 *  @param {Object} [opts] processing options.
 *
 *  @option {RegExp} start comment start pattern.
 *  @option {RegExp} end comment end pattern.
 *  @option {RegExp} strip comment strip pattern.
 *  @option {RegExp} trail pattern to strip trailing comment characters.
 *  @option {Boolean} last extract description from the last line.
 *
 *  @returns list of language rules.
 */
function shell(opts) {
  opts = opts || {};
  opts.start = opts.start instanceof RegExp ? opts.start : /#+/;
  opts.end = opts.end instanceof RegExp ? opts.end : /#+/;
  opts.lead = opts.lead instanceof RegExp ? opts.strip : /^\s*#+/;
  opts.trail = opts.trail instanceof RegExp ? opts.trail: /\s*#+.*$/;
  opts.last = opts.last !== undefined ? opts.last : false;

  // also strip trailing meta characters
  function strip(lines) {
    return lines.map(function(line) {
      line = line.replace(opts.lead, '');
      return line.replace(opts.trail, '');
    }) 
  }

  opts.strip = strip;

  // single rule style for this language pack
  return [lang.single(opts)];
}

module.exports = shell;
