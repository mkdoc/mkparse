var through = require('through3');

/**
 *  Parse comments from an array of lines.
 *
 *  When a comment is parsed an object is pushed to the stream 
 *  with an array of `lines`, the `rule` for the comment and the 
 *  `start` and `end` line numbers.
 *
 *  @module {constructor} Comment
 *  @param {Object} [opts] stream options.
 *  @option {Array|Function} rules defines the comment rules.
 *  @option {Object} options to pass to the `rules` function.
 */
function Comment(opts) {
  opts = opts || {};

  var rules = Array.isArray(opts.rules) || (opts.rules instanceof Function)
    ? opts.rules : require('../lang/index.js')
    , i
    , method;

  if(!Array.isArray(rules)) {
    rules = [rules]; 
  }

  this.rules = [];
  for(i = 0;i < rules.length;i++) {
    method = rules[i];
    this.rules = this.rules.concat(method(opts.options));
  }

  // line number
  this.line = 0;

  // result of attempt to match a line with a rule
  this.result = null;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member Comment
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {
  var i
    , line;

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];

    this.line++;

    // test for comment start
    if(!this.result) {
      this.result = this.find(line); 
      if(!this.result && this.result !== false) {
        this.push([line]);
      }else if(this.result && this.result.rule) {
        // handles comments that terminate on the same line
        if(this.result.rule.multiline && this.result.closed) {
          this.reset();
          continue;
        }
      }
    // got an existing comment block
    }else{
      if(this.result.rule.close(line)) {
        if(this.result.rule.multiline) {
          this.result.lines.push(line);
        }
        this.result.end =
          this.result.rule.multiline ? this.line : (this.line - 1);
        this.push(this.result);

        // might have another single-line comment style on this line
        if(!this.result.rule.multiline) {
          this.line--;
          i--;
        }

        this.reset();
      }else{
        this.result.lines.push(line);
      }
    }
  }

  cb();
}

function flush(cb) {
  if(this.result && this.result.rule) {
    this.push(this.result); 
    this.reset();
  }
  cb();
}

/**
 *  Find a rule for a given line and parse multiple inline comments.
 *
 *  @private
 *  @param {String} line parsed line.
 *  @param {String} content non-comment content.
 *  @param {Array} parsed previously parsed inline comments.
 */
function find(line, content, parsed) {
  var i
    , rule
    , match
    , ended
    , source = line
    , extra
    , result;
  
  content = content || '';
  parsed = parsed || [];

  for(i = 0;i < this.rules.length;i++) {
    rule = this.rules[i];
    if((match = rule.open.call(rule, line))) {
      result = {
        rule: rule,
        line: line,
        start: this.line,
        end: this.line,
        match: match,
        lines: [source],
        newline: true
      };

      if(match.index > 0) {
        this.push(line.substr(0, match.index));
      }

      // starting comment, does it finish on this line?
      if((ended = rule.close.call(rule, line, match))) {
        result.closed = ended;

        source = line.substr(
          match.index, (ended.index - match.index) + ended[0].length);
        extra = line.substr(ended.index + ended[0].length);

        result.lines = [source];
        if(extra) {
          result.newline = false;
        }
        this.push(result);
        parsed.push(result);

        // more comments to process on this line
        if(extra) {
          return find.call(this, extra, content, parsed);
        }
      // strip any leading data before start comment
      }else{
        source = line.substr(match.index);
      }

      result.lines = [source];
      result.content = content;
      return result;
    }
  }

  // return content after parsed comments (trailer)
  if(parsed.length) {
    this.push(line);
    return false;
  }
}

/**
 *  @private
 */
function reset() {
  this.result = null;
}

Comment.prototype.find = find;
Comment.prototype.reset = reset;


module.exports = through.transform(transform, flush, {ctor: Comment})
