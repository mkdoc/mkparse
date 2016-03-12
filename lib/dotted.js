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

function dotted(tags) {
  return tags.reduce(function(tags, tag) {
    if (tag.name.indexOf('.') !== -1) {
      var parentName;
      var parentTag;
      var parentTags = tags;
      var parts = tag.name.split('.');

      while (parts.length > 1) {
        parentName = parts.shift();
        parentTag  = find(parentTags, {
          id  : tag.id,
          name : parentName
        });

        if (!parentTag) {
          parentTag = {
            id          : tag.id,
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

module.exports = dotted;
