var through = require('through3')
  , EOL = require('os').EOL;

/**
 *  Collate comments and source content into a stream.
 *
 *  Allows for writing files that contains only content, only comments or 
 *  both content and comments. By default this stream will pass through 
 *  comments and content.
 *
 *  To disable content from the stream (comments only) use:
 *
 *  ```javascript
 *  {content: false}
 *  ```
 *
 *  To disable comments from the stream (source content only) use:
 *
 *  ```javascript
 *  {comment: false}
 *  ```
 *
 *  When the `buffer` option is set all output is buffered into 
 *  the `buffer` property as a `string`, listen for the `finish` event before 
 *  attempting to access the buffer contents.
 *
 *  @module {constructor} Collator
 *  @param {Object} [opts] stream options.
 *
 *  @option {Boolean} content push content chunks to the stream.
 *  @option {Boolean} comment push comment chunks to the stream. 
 *  @option {Boolean} buffer buffer output.
 *  @option {Boolean} stringify convert output to JSON strings.
 *  @option {Number} indent number of spaces to indent JSON.
 */
function Collator(opts) {
  opts = opts || {};
  this.content = opts.content !== undefined ? opts.content : true;
  this.comment = opts.comment !== undefined ? opts.comment : true;
  if(opts.buffer) {
    this.buffer = '';
  }

  this.stringify = opts.stringify !== undefined ? opts.stringify : false;
  this.indent = typeof(opts.indent) === 'number' ? opts.indent : 0;
}

/**
 *  Stream transform.
 *
 *  @private {function} transform
 *  @member Collator
 *  @param {Array} chunk lines to process.
 *  @param {String} encoding character encoding.
 *  @param {Function} callback function.
 */
function transform(chunk, encoding, cb) {
  var err;

  if(this.content) {
    // inline content chunks are strings
    if(typeof chunk === 'string') {
      //this.append(chunk || EOL);
      err = this.append(chunk);
    // line content chunks are unparsed lines
    }else if(Array.isArray(chunk)) {
      err = this.append(chunk.reduce(function(prev, curr) {
        return prev + (curr + EOL);
      }, ''));
    }
  }
  
  if(!err && chunk && chunk.source) {
    if(this.comment) {
      err = this.append(this.stringify ? chunk : chunk.source);
    }
    
    // preserve line breaks when comments are not included
    if(!err && chunk.newline && !this.stringify) {
      err = this.append(EOL); 
    }
  }

  cb(err);
}

/**
 *  Append content to the buffer or stream.
 *
 *  @private
 */
function append(str) {
  if(this.stringify && (this.comment && str.source)) {
    try {
      str = JSON.stringify(str, undefined, this.indent) + EOL;
    }catch(e) {
      return e;
    }
  }
  this.push(str);
  if(this.buffer !== undefined) {
    this.buffer += str; 
  }
}

Collator.prototype.append = append;

module.exports = through.transform(transform, {ctor: Collator})
