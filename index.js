var fs = require('fs')
  , EOL = require('os').EOL
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

function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || rules;

  // current list of comment lines
  this.current = null;

  // current raw source string
  this.source = null;

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
    if(!this.current) {
      this.rule = find.call(this, line); 
      this.start = this.line;
    }else{
      if(this.rule && this.rule.end(line)) {
        this.current.push(line);
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
    this.line++;
  }
  cb();
}

function Parser(opts) {
  opts = opts || {};

  this.rule = opts.rule instanceof RegExp
    ? opts.rule : /^\s*@/;

  this.pattern = opts.pattern instanceof RegExp
    ? opts.pattern : /^\s*@(\w+)\s?(\{(\w+)\})?\s?(\[?\w+\]?)?\s?(.*)?/;

  this.optional = opts.optional instanceof RegExp
    ? opts.optional : /^\[([^\]]+)\]$/;

  this.trim = typeof opts.trim === 'boolean' ? opts.trim : true;

  function parse(line, tag) {
    function replacer(match, id, typedef, type, name, description) {
      tag.tag = id;
      tag.type = type || '';
      tag.name = name || '';
      tag.description = description || '';
    }

    line.replace(this.pattern, replacer);

    tag.optional = this.optional.test(tag.name);
    if(tag.optional) {
      tag.name = tag.name.replace(this.optional, '$1'); 
    }

    return tag;
  }

  this.parse = opts.parse instanceof Function
    ? opts.parse : parse;
}

/**
 *  Parse comment description and tags.
 */
function parser(chunk, encoding, cb) {
  var lines = chunk.rule.strip(chunk.lines)
    , i
    , line
    , comment = {
        source: chunk.lines.join(EOL),
        description: '',
        line: chunk.start,
        pos: {start: chunk.start, end: chunk.end},
        tags: []
      }
    , seen = false
    , result;

  function parse(start, index, lineno) {
    var tag = {
      tag: '',
      type: '',
      optional: false,
      line: lineno
    }
    this.parse.call(this, start, tag);
    for(var i = index + 1;i < lines.length;i++) {
      if(this.rule.test(lines[i])) {
        break
      }else{
        tag.description += lines[i] + EOL;
        index++;
      } 
    }

    if(this.trim) {
      tag.description = tag.description.trim(); 
    }

    return {tag: tag, end: index};
  }

  for(i = 0;i < lines.length;i++) {
    line = lines[i];
    if(this.rule.test(line)) {
      result = parse.call(this, line, i, chunk.start + i);
      comment.tags.push(result.tag);
      i = result.end;
      seen = true;
    }else if(!seen){
      comment.description += line + EOL; 
    }
  }

  console.dir(comment);

  if(this.trim) {
    comment.description = comment.description.trim(); 
  }

  this.push(comment);
  cb();
}

var Comment = through.transform(comment, {ctor: Comment})
var Parser = through.transform(parser, {ctor: Parser})

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
