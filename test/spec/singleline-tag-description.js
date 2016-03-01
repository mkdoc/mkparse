var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse tag description w/ single tag (singleline)', function(done) {
    var source = 'test/fixtures/singleline-tag-description.js'
      , stream = parse.load(source)
      , expected = ('' + fs.readFileSync(source)).trim()
      , desc = 'var foo = \'bar\'\n  , x = \'y\';';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(4);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].id).to.eql('usage');
      expect(comment.tags[0].description).to.eql(desc);
      done();
    })
  });

});
