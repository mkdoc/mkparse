module.exports = {
  // pattern that collects tag lines
  rule: /^\s*@/,
  // pattern the collects the constituent parts of the tag line
  pattern : /^\s*@(\w+)\s?(\{(\w+)\})?\s?(\[?\w+\]?)?\s?(.*)?/,
  // pattern to test and extract the [] optionality notation
  optional: /^\[([^\]]+)\]$/,
  // pattern to strip leading whitespace from lines
  whitespace: /^[ \t]{1,1}/,
  // parses the tag line using `this.pattern`
  parse: function parser(line, tag) {

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

}
