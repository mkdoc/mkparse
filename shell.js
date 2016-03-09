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
  var start = opts.start instanceof RegExp ? opts.start : /#+/
    , end = opts.end instanceof RegExp ? opts.end : /#+/
    , strip = opts.strip instanceof RegExp ? opts.strip : /^\s*#+/
    , trail = opts.trail instanceof RegExp ? opts.trail: /\s*#+.*$/
    , last = opts.last !== undefined ? opts.last : false;

  // single rule style for this language pack
  return [{
    start: function(line) {
      return start.exec(line);
    },
    end: function(line) {
      return !end.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        line = line.replace(strip, '');
        return line.replace(trail, '');
      }) 
    },
    last: last
  }];
}

module.exports = shell;
