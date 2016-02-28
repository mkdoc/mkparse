var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse tag description w/ single tag (multiline)', function(done) {
    var source = 'test/fixtures/multiline-tag-description.js'
      , stream = parse.file(source)
      , expected = ('' + fs.readFileSync(source)).trim()
      , desc = 'var foo = \'bar\'\n  , x = \'y\';';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(6);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].tag).to.eql('usage');
      expect(comment.tags[0].description).to.eql(desc);
      done();
    })
  });

});
