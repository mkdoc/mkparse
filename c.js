/**
 *  Creates an array of language rules for the C family of languages.
 *
 *  A language rule is an object containing the `start`, `end` and `strip` 
 *  functions.
 *
 *  The start and end functions are passed the current line and should 
 *  return the `exec` match for the pattern.
 *
 *  The strip function is passed an array of lines for the entire comment and 
 *  should remove comment start, end and intermediate markup.
 *
 *  By default recognises continuous lines with `//` comments and terminated 
 *  multi-line comments starting with `/**`.
 *
 *  To include `/*` comments as well set the `greedy` option:
 *
 *  ```javascript
 *  {multi: {greedy: true}
 *  ```
 *
 *  @function c
 *  @param {Object} [opts] processing options.
 *
 *  @option {Object} multi multi-line rule configuration.
 *  @option {Object} single single-line rule configuration.
 *
 *  @returns list of language rules.
 */
function c(opts) {
  opts = opts || {};
  var set = []
    , useMulti = opts.multi !== undefined ? opts.multi : true
    , useSingle = opts.single !== undefined ? opts.single : true;

  if(useMulti) {
    set.push(multi(opts.multi));
  }

  if(useSingle) {
    set.push(single(opts.single)); 
  }

  return set;
}

/**
 *  Creates a multi-line rule, when no options are given creates the 
 *  default C family multi-line rule.
 *  
 *  @function multi
 *  @param {Object} [opts] processing options.
 *
 *  @option {Boolean} greedy include `/*` comments.
 *  @option {RegExp} start comment start pattern.
 *  @option {RegExp} end comment end pattern.
 *  @option {RegExp} strip comment strip pattern.
 *  @option {Boolean} last extract description from the last line.
 *
 *  @returns {Object} multi-line language rule.
 */
function multi(opts) {
  opts = opts || {};
  var start = opts.greedy ? /\/\*+/ : /\/\*\*+/
    , end = opts.end instanceof RegExp ? opts.end : /\*+\//
    , strip = opts.strip instanceof RegExp ? opts.strip : /^\s*\*([^\/]?)/
    , last = opts.last !== undefined ? opts.last : true;

  // override start pattern
  if(opts.start instanceof RegExp) {
    start = opts.start; 
  }

  return {
    start: function(line) {
      return start.exec(line);
    },
    end: function(line) {
      return end.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {

        // this catchs opening declarations: '/**'
        line = line.replace(start, '');

        // this catches the close tag: `*/`, should come before pattern below!
        line = line.replace(end, '');

        // and lines prefixed with ` *`
        line = line.replace(strip, '$1');

        return line;
      }) 
    },
    last: last
  }
}

/**
 *  Creates a single-line rule, when no options are given creates the 
 *  default C family single-line rule.
 *  
 *  @function single
 *  @param {Object} [opts] processing options.
 *
 *  @option {RegExp} start comment start pattern.
 *  @option {RegExp} end comment end pattern.
 *  @option {RegExp} strip comment strip pattern.
 *  @option {Boolean} last extract description from the last line.
 *
 *  @returns {Object} single-line language rule.
 */
function single(opts) {
  opts = opts || {};
  var start = opts.start instanceof RegExp ? opts.start : /\/\//
    , end = opts.end instanceof RegExp ? opts.end : /\/\//
    , strip = opts.strip instanceof RegExp ? opts.strip : /^\s*\/\//
    , last = opts.last !== undefined ? opts.last : false;

  return {
    start: function(line) {
      return start.exec(line);
    },
    end: function(line) {
      return !end.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(strip, '');
      }) 
    },
    last: last
  }
}

c.multi = multi;
c.single = single;

module.exports = c;
