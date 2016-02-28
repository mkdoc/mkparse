var fs = require('fs')
  , EOL = require('os').EOL
  , through = require('through3')
  , LineStream = require('stream-lines');

/**
 *  Parse a file.
 *
 *  The options are passed to the `LineStream`, `Comment` and `Parser`.
 *
 *  @function load
 *  @param {String} file path.
 *  @param {Object} [opts] processing options.
 */
function load(path, opts) {
  var source = fs.createReadStream(path); 
  return source
    .pipe(new LineStream(opts))
    .pipe(new Comment(opts))
    .pipe(new Parser(opts));
}

/**
 *  Borrowed from comment-parser.
 *
 *  @private
 */
function find(list, filter) {
  var k, i = list.length, matchs = true;
  while (i--) {
    for (k in filter) { 
      matchs = (filter[k] === list[i][k]) && matchs;
    }
    if (matchs) { return list[i]; }
  }
  return null;
}

/**
 *  Creates a comment stream.
 *
 *  @constructor Comment
 *  @param {Object} [opts] stream options.
 *  @option {Object} rules defines the comment rules.
 */
function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || require('./c');

  // current list of comment lines
  this.current = null;

  // current raw source string
  this.source = null;

  // current line number
  this.line = 0;
}

/**
 *  Parse comments from an array of lines.
 *
 *  When a comment is parsed an object is pushed to the stream 
 *  with an array of `lines`, the `rule` for the comment and the 
 *  `start` and `end` line numbers.
 *
 *  @protected {function} comment
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
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
  }

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];

    this.line++;

    if(!this.current) {
      // find the rule in the map
      this.rule = find.call(this, line); 
      if(this.rule) {
        // set up comment block
        block = {
            lines: this.current,
            rule: this.rule,
            start: this.line,
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
  }
  cb();
}

/**
 *  Creates a tag parser stream.
 *
 *  @constructor Parser
 *  @param {Object} [opts] stream options.
 *  @option {Object} tag defines the tag patterns, see [tag](#tag)
 *  @option {Boolean} dotted parse dotted names in tags.
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
}

/**
 */

/**
 *  Comment and tag parser, parses comment description and tags.
 *
 *  @protected {function} parser
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 *
 *  @event comment when a comment has been parsed.
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
    comment.tags = comment.tags.reduce(function(tags, tag) {
      if (tag.name.indexOf('.') !== -1) {
        var parentName;
        var parentTag;
        var parentTags = tags;
        var parts = tag.name.split('.');

        while (parts.length > 1) {
          parentName = parts.shift();
          parentTag  = find(parentTags, {
            tag  : tag.tag,
            name : parentName
          });

          if (!parentTag) {
            parentTag = {
              tag         : tag.tag,
              line        : Number(tag.line),
              name        : parentName,
              type        : '',
              description : ''
            };
            parentTags.push(parentTag);
          }

          parentTag.tags = parentTag.tags || [];
          parentTags = parentTag.tags;
        }

        tag.name = parts[0];
        parentTags.push(tag);
        return tags;
      }

      return tags.concat(tag);
    }, []);
  }
    

  this.emit('comment', comment);
  this.push(comment);
  cb();
}

var Comment = through.transform(comment, {ctor: Comment})
var Parser = through.transform(parser, {ctor: Parser})

module.exports = {
  load: load,
  Comment: Comment,
  Parser: Parser
}
