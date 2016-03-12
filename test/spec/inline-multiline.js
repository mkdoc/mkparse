var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse inline multiline comment block', function(done) {
    var source = 'test/fixtures/inline-multiline.js'
      , stream = parse.load(source)
      , expected = '/** @param {Object} opts request options */';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(1);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].line).to.eql(1);
      expect(comment.tags[0].id).to.eql('param');
      expect(comment.tags[0].name).to.eql('opts');
      expect(comment.tags[0].optional).to.eql(false);
      expect(comment.tags[0].description).to.eql('request options');
      expect(comment.tags[0].type).to.eql('Object');
      done();
    })
  });

});
