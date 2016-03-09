/**
 *  Patterns for C style comment blocks.
 *
 *  @module C
 */
var multi = {
    start: function(line) {
      return /\/\*\*/.exec(line);
    },
    end: function(line) {
      return /\*\//.exec(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {

        // this catchs opening declarations: '/**'
        line = line.replace(/\/\*\*/, '');

        // this catches the close tag: `*/`, should come before pattern below!
        line = line.replace(/\*+\//, '');

        // and lines prefixed with ` *`
        line = line.replace(/^\s*\*([^\/]?)/, '$1');

        return line;
      }) 
    },
    last: true
  }
  , single = {
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
    };

module.exports = [
  multi,
  single
]
