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
        }
      },
      block: {
        start: function(line) {
          return /^\s*\/\//.test(line);
        },
        end: function(line) {
          return !/^\s*\/\//.test(line);
        }
      }
    }

function ParserStream(opts) {
  opts = opts || {};
}

function CommentStream(opts) {
  opts = opts || {};

  this.rules = opts.rules || rules;
  this.current = null;
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
    if(!this.current) {
      this.rule = find.call(this, line); 
    }else{
      if(this.rule && this.rule.end(line)) {
        this.push(this.current);
        this.current = null;
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
  cb();
}

var Comment = through.transform(comment, {ctor: CommentStream})
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
