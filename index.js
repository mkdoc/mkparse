var fs = require('fs')
  //, assert = require('assert')
  , EOL = require('os').EOL
  , through = require('through3')
  , LineStream = require('stream-lines');

function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || require('./c');

  //assert(this.rules, 'unsupported comment language ' + opts.lang);

  // current list of comment lines
  this.current = null;

  // current raw source string
  this.source = null;

  // current line number
  this.line = 1;

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
    , line
    , block;

  function find(line) {
    for(var k in this.rules) {
      if(this.rules[k].start(line)) {
        this.current = [line]; 
        return this.rules[k];
      }
    }
  }

  function reset() {
    this.current = null;
    this.rule = null;
    this.start = 0;
  }

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];
    if(!this.current) {
      this.rule = find.call(this, line); 
      this.start = this.line;
      if(this.rule) {

        // set up comment block
        block = {
            lines: this.current,
            rule: this.rule,
            start: this.start,
            end: this.line};

        // handles comments that terminate on the same line
        if(this.rule.end(line)) {
          this.push(block);
          reset.call(this);
          continue;
        }
      }
    }else{
      if(this.rule && this.rule.end(line)) {
        if(this.rule.last) {
          this.current.push(line);
        }
        block.end = this.rule.last ? this.line : (this.line - 1);
        this.push(block);
        reset.call(this);
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

  // default tag configuration
  this.tag = opts.tag || require('./tag');

  // pattern that determines if we have encountered a tag
  this.rule = this.tag.rule;

  // extraction pattern for matched tags
  this.pattern = this.tag.pattern;

  // pattern that determines optionality
  this.optional = this.tag.optional;

  // pattern that strips leading whitespace from description lines
  this.whitespace = this.tag.whitespace; 

  // parse function
  this.parse = this.tag.parse; 

  // whether to trim leading and trailing whitespace from descriptions
  // for intermediary lines use the `whitespace` pattern
  this.trim = typeof opts.trim === 'boolean' ? opts.trim : true;
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
    , result
    , desc = [];

  function parse(start, index, lineno) {
    var tag = {
        tag: '',
        type: '',
        optional: false,
        line: lineno,
        source: start
      }
      , line
      , desc = [];

    this.parse.call(this, start, tag);
    for(var i = index + 1;i < lines.length;i++) {
      line = lines[i];
      if(this.rule.test(lines[i])) {
        break
      }else{
        line = line.replace(this.whitespace, ''); 
        desc.push(line);
        index++;
      }
      tag.source += lines[i] + EOL;
    }

    tag.description = desc.join(EOL);

    if(this.trim) {
      tag.description = tag.description.trim(); 
    }

    return {tag: tag, end: index};
  }

  for(i = 0;i < lines.length;i++) {
    line = lines[i];
    seen = this.rule.test(line);
    line = line.replace(this.whitespace, ''); 

    if(seen) {
      result = parse.call(this, line, i, chunk.start + i);
      comment.tags.push(result.tag);
      i = result.end;
      seen = true;
    }else{
      desc.push(line);
    }
  }

  comment.description = desc.join(EOL);

  if(this.trim) {
    comment.description = comment.description.trim(); 
  }

  this.emit('comment', comment);
  this.push(comment);
  cb();
}

var Comment = through.transform(comment, {ctor: Comment})
var Parser = through.transform(parser, {ctor: Parser})

function file(path, opts) {
  var source = fs.createReadStream(path); 
  return source
    .pipe(new LineStream(opts))
    .pipe(new Comment(opts))
    .pipe(new Parser(opts));
}

module.exports = {
  file: file
}
