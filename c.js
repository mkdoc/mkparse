// C family comment blocks
module.exports = {
  multiline: {
    start: function(line) {
      return /\/\*\*/.test(line);
    },
    end: function(line) {
      return /\*\//.test(line);
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
  },
  block: {
    start: function(line) {
      return /^[^\/]*\/\//.test(line);
    },
    end: function(line) {
      return !/\/\//.test(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(/^\s*\/\//, '');
      }) 
    },
    last: false
  }
}
