// C family comment blocks
module.exports = {
  multiline: {
    start: function(line) {
      return /^\s*\/\*\*/.test(line);
    },
    end: function(line) {
      return /^\s*\*\//.test(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(/^\s*\/?\*+\*?\/?/, '');
      }) 
    }
  },
  block: {
    start: function(line) {
      return /^\s*\/\//.test(line);
    },
    end: function(line) {
      return !/^\s*\/\//.test(line);
    },
    strip: function(lines) {
      return lines.map(function(line) {
        return line.replace(/^\s*\/\//, '');
      }) 
    }
  }
}
