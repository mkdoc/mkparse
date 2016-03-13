var through = require('through3')
  , EOL = require('os').EOL;

/**
 *  Comment and tag parser, parses comment description and tags.
 *
 *  @module {constructor} Parser
 *  @param {Object} [opts] stream options.
 *  @option {Object} tag defines the tag patterns, see [tag](#tag)
 *  @option {Boolean} dotted parse dotted names in tags.
 *
 *  @event comment when a comment has been parsed.
 *  @event content when a content chunk is received.
 */
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

  // whether to enable dotted property expansion
  this.dotted = opts.dotted;

  if(this.dotted && !(this.dotted instanceof Function)) {
    this.dotted = require('./dotted'); 
  }
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member Parser
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {

  // got content array or string
  if(!chunk || !chunk.rule) {
    this.push(chunk);
    this.emit('content', chunk);
    return cb(); 
  }

  var lines = chunk.rule.strip(chunk.lines)
    , i
    , line
    , comment = {
        source: chunk.lines.join(EOL),
        description: '',
        line: chunk.start,
        pos: {start: chunk.start, end: chunk.end},
        newline: Boolean(chunk.newline),
        tags: []
      }
    , seen = false
    , result
    , desc = [];

  if(this.file) {
    comment.file = this.file; 
  }

  function parse(start, index, lineno) {
    var tag = {
        id: '',
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

    // got short description, prepend
    if(tag.description) {
      desc.unshift(tag.description); 
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

  if(this.dotted) {
    comment.tags = this.dotted(comment.tags);
  }

  this.emit('comment', comment);
  this.push(comment);
  cb();
}

/**
 *  Creates a stream that transforms to newline-delimited JSON, the 
 *  created stream is piped from this parser.
 *
 *  @function stringify
 *  @member Parser
 *  @param {Number} indent the number of spaces to indent the JSON.
 *  @param {Boolean} comment only include comment output.
 *
 *  @returns the stringify stream.
 */
function stringify(indent, comment) {
  indent = indent || 0;
  var Collator = require('./collator')
    , collator = new Collator(
        {stringify: true, indent: indent, content: !comment});
  return this.pipe(collator);
}

Parser.prototype.stringify = stringify;

module.exports = through.transform(transform, {ctor: Parser})
