var through = require('through3')
  , EOL = require('os').EOL;

/**
 *  Collate comments and source content into a stream.
 *
 *  Allows for writing files that contains only content, only comments or 
 *  both content and comments. By default this stream will pass through 
 *  comments and content.
 *
 *  To disable content from the stream use (comments only) use:
 *
 *  ```javascript
 *  {content: false}
 *  ```
 *
 *  To disable comments from the stream use (source content only) use:
 *
 *  ```javascript
 *  {comment: false}
 *  ```
 *
 *  When the `buffer` option is set all output is buffered into 
 *  the `buffer` property, listen for the `finish` event before 
 *  attempting to access the buffer contents.
 *
 *  @module {constructor} Collator
 *  @param {Object} [opts] stream options.
 *  @option {Boolean} content push content chunks to the stream.
 *  @option {Boolean} comment push comment chunks to the stream. 
 *  @option {Boolean} buffer buffer output.
 */
function Collator(opts) {
  opts = opts || {};
  this.content = opts.content !== undefined ? opts.content : true;
  this.comment = opts.comment !== undefined ? opts.comment : true;
  if(opts.buffer) {
    this.buffer = '';
  }
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

  if(this.content) {
    // inline content chunks are strings
    if(typeof chunk === 'string') {
      this.append(chunk || EOL);
    // line content chunks are unparsed lines
    }else if(Array.isArray(chunk)) {
      this.append(chunk.reduce(function(prev, curr) {
        return prev + (curr + EOL);
      }, ''));
    }
  }
  
  if(this.comment && chunk && chunk.source) {
    this.append(chunk.source + (chunk.newline ? EOL : ''));
  }

  cb();
}

/**
 *  Append content to the buffer or stream.
 *
 *  @private
 */
function append(str) {
  this.push(str);
  if(this.buffer !== undefined) {
    this.buffer += str; 
  }
}

Collator.prototype.append = append;

module.exports = through.transform(transform, {ctor: Collator})
