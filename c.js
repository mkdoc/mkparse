/**
 *  Creates an array of language rules for the C family of languages.
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

function multi(opts) {
  opts = opts || {};
  var start = opts.greedy ? /\/\*/ : /\/\*\*/
    , end = opts.end instanceof RegExp ? opts.end : /\*\//
    , close = opts.close instanceof RegExp ? opts.close : /\*+\//
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
        line = line.replace(close, '');

        // and lines prefixed with ` *`
        line = line.replace(strip, '$1');

        return line;
      }) 
    },
    last: last
  }
}

function single(opts) {
  opts = opts || {};
  return {
    start: function(line) {
      return /\/\//.exec(line);
    },
    end: function(line) {
      return !/\/\//.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(/^\s*\/\//, '');
      }) 
    },
    last: false
  }
}

c.multi = multi;
c.single = single;

module.exports = c;
