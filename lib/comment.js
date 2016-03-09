var through = require('through3');

/**
 *  Creates a comment stream.
 *
 *  @constructor Comment
 *  @param {Object} [opts] stream options.
 *  @option {Object} rules defines the comment rules.
 */
function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || require('../c');

  // current list of comment lines
  this.current = null;

  // current raw source string
  this.source = null;

  // current line number
  this.line = 0;

  // result of current attempt to match a line with a rule
  this.result = null;
}

/**
 *  Parse comments from an array of lines.
 *
 *  When a comment is parsed an object is pushed to the stream 
 *  with an array of `lines`, the `rule` for the comment and the 
 *  `start` and `end` line numbers.
 *
 *  @protected {function} comment
 *  @member Comment
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function comment(chunk, encoding, cb) {
  var i
    , line
    , block;

  function find(line) {
    var i
      , rule
      , match
      , ended
      , source = line
      , extra
      , result;

    for(i = 0;i < this.rules.length;i++) {
      rule = this.rules[i];
      if((match = rule.start.call(rule, line))) {
        result = {rule: rule, line: line, start: match};

        // starting comment, does it finish on this line?
        if((ended = rule.end.call(rule, line))) {
          result.end = ended;

          source = line.substr(
            match.index, (ended.index - match.index) + ended[0].length);
          extra = line.substr(ended.index + ended[0].length);

          this.push({
            lines: [source],
            rule: rule,
            start: this.line,
            end: this.line});

          // more comments to process on this line
          if(extra) {
            return find.call(this, extra);
          }
        // strip any leading data before start comment
        }else{
          source = line.substr(match.index);
        }
        this.current = [source];
        return result;
      }
    }
  }

  function reset() {
    this.current = null;
    this.result = null;
  }

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];

    this.line++;

    if(!this.current) {
      // find the rule in the map
      this.result = find.call(this, line); 
      if(this.result) {
        // set up comment block
        block = {
            lines: this.current,
            rule: this.result.rule,
            start: this.line,
            end: this.line};

        // handles comments that terminate on the same line
        if(this.result.end) {
          reset.call(this);
          continue;
        }
      }
    }else{
      if(this.result && this.result.rule.end(line)) {
        if(this.result.rule.last) {
          this.current.push(line);
        }
        block.end = this.result.rule.last ? this.line : (this.line - 1);
        this.push(block);
        reset.call(this);
      }else{
        this.current.push(line);
      }
    }
  }
  cb();
}

module.exports = through.transform(comment, {ctor: Comment})
