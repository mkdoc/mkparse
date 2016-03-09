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
    var i, rule, res;
    for(i = 0;i < this.rules.length;i++) {
      rule = this.rules[i];
      if((res = rule.start.call(rule, line))) {
        this.current = [line]; 
        if(typeof res === 'string') {
          this.current = [res]; 
        }
        return rule;
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

module.exports = through.transform(comment, {ctor: Comment})
