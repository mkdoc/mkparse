var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse inline singleline comment block', function(done) {
    var source = 'test/fixtures/inline-singleline.js'
      , stream = parse.load(source)
      , expected = '// @private {String} foo private constant';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(1);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].line).to.eql(1);
      expect(comment.tags[0].id).to.eql('private');
      expect(comment.tags[0].name).to.eql('foo');
      expect(comment.tags[0].optional).to.eql(false);
      expect(comment.tags[0].description).to.eql('private constant');
      expect(comment.tags[0].type).to.eql('String');
      done();
    })
  });

});
