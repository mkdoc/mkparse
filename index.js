var fs = require('fs')
  , through = require('through3')
  , LineStream = require('stream-lines')
  , rules = {
      multiline: {
        start: function(line) {
          return /^\s*\/\*\*/.test(line);
        },
        end: function(line) {
          return /^\s*\*\//.test(line);
        },
        strip: function(lines) {
          return lines.map(function(line) {
            return line.replace(/^\s*\/?\*+\*?/, '');
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

function ParserStream(opts) {
  opts = opts || {};
}

function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || rules;

  // current list of comment lines
  this.current = null;

  // current line number
  this.line = 0;

  // current comment start line number
  this.start = 0;
}

/**
 *  Comment transform stream.
 *
 *  Parse a comment from an array of lines.
 *
 *  @function comment
 *  @param {Array} chunk array of lines to process.
 */
function comment(chunk, encoding, cb) {
  var i
    , line;

  function find(line) {
    for(var k in this.rules) {
      if(this.rules[k].start(line)) {
        this.current = [line]; 
        return this.rules[k];
      }
    }
  }

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];
    this.line++;
    if(!this.current) {
      this.rule = find.call(this, line); 
      this.start = this.line;
    }else{
      if(this.rule && this.rule.end(line)) {
        this.push(
          {
            lines: this.current,
            rule: this.rule,
            start: this.start,
            end: this.line});
        this.current = null;
        this.rule = null;
        this.start = 0;
      }else{
        this.current.push(line);
      }
    }
  }
  cb();
}

/**
 *  Parse meta data from a comment block.
 */
function parser(chunk, encoding, cb) {
  console.dir(chunk);
  var lines = chunk.rule.strip(chunk.lines);
  console.dir(lines)
  cb();
}

var Comment = through.transform(comment, {ctor: Comment})
var Parser = through.transform(parser, {ctor: ParserStream})

function file(path, opts) {
  var source = fs.createReadStream(path); 
  source
    .pipe(new LineStream(opts))
    .pipe(new Comment(opts))
    .pipe(new Parser(opts));
}

module.exports = {
  file: file
}
