/**
 *  Defines the patterns and functions that perform the tag parsing.
 *
 *  Create a custom tag definition if you wanted to use an alternative 
 *  syntax or prefer something other than `@` as the tag identifier.
 *
 *  The generic syntax for tags is: `@id {type[=value]} name description`; 
 *  everything but the tag `id` is considered optional.
 *
 *  Which when given: `@property {String=tmpfs} [nickname] user` will expand 
 *  to a tag object such as:
 *
 *  ```javascript
 *  {
 *    id: 'property',
 *    type: 'String',
 *    value: 'tmpfs',
 *    name: 'nickname',
 *    description: 'user',
 *    optional: true
 *  }
 *  ```
 *
 *  See the [tag parser](#parser).
 *
 *  @module Tag
 */
module.exports = {

  /**
   *  Pattern that collects tag lines.
   *
   *  @property {RegExp} rule
   */
  rule: /^\s*@/,

  /**
   *  Pattern that collects tag component parts.
   *
   *  @property {RegExp} pattern
   */
  pattern :
    /^\s*@([\w_-]+)\s?(\{([\w_-]+)=?([^\}]*)?\})?\s?(\[?[\.\w_-]+\]?)?\s?(.*)?/,

  /**
   *  Pattern that determines optionality.
   *  @property {RegExp} optional
   */
  optional: /^\[([^\]]+)\]$/,

  /**
   *  Pattern that determines how to strip leading whitespace from 
   *  lines.
   *  
   *  By default will match a single space or a tab character once, depending 
   *  upon your comment style you should adjust this so that whitespace is 
   *  preserved as intended.
   *
   *  @property {RegExp} whitespace
   */
  whitespace: /^[ \t]{1,1}/,

  /**
   *  Parses the component parts of a tag definition.
   *
   *  This will add the `id`, `type`, `name` and `description` 
   *  fields to the input `tag` argument.
   *  
   *  @function parse
   *  @param {String} line current line being parsed.
   *  @param {Object} tag target for parsed data.
   */
  parse: function parser(line, tag) {

    function replacer(match, id, typedef, type, value, name, description) {
      tag.id = id;
      tag.type = type || '';
      tag.name = name || '';
      tag.value = value || '';
      tag.description = description || '';
    }

    line.replace(this.pattern, replacer);
    tag.optional = this.optional.test(tag.name);

    if(tag.optional) {
      tag.name = tag.name.replace(this.optional, '$1'); 
    }

    return tag;
  }

}
