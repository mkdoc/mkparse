var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse dotted names', function(done) {
    var source = 'test/fixtures/dotted.js'
      , stream = parse.load(source, {dotted: true})
      , tagName = 'my-tag';

    stream.once('comment', function(comment) {
      expect(comment.source).to.be.a('string');
      expect(comment.description).to.be.a('string')
        .to.eql('Description');
      expect(comment.line).to.be.a('number')
        .to.eql(1);
      expect(comment.pos).to.be.an('object');
      expect(comment.pos.start).to.eql(1);

      expect(comment.tags[0].tag).to.eql(tagName);
      expect(comment.tags[0].tags[0].tag).to.eql(tagName);
      expect(comment.tags[0].tags[0].tags[0].tag).to.eql(tagName);

      expect(comment.tags[0].name).to.eql('name');
      expect(comment.tags[0].tags[0].name).to.eql('sub-name');
      expect(comment.tags[0].tags[0].tags[0].name).to.eql('sub-sub-name');

      expect(comment.tags[0].line).to.eql(4);
      expect(comment.tags[0].tags[0].line).to.eql(5);
      expect(comment.tags[0].tags[0].tags[0].line).to.eql(6);

      expect(comment.tags[1].tag).to.eql('deep-tag');
      expect(comment.tags[1].name).to.eql('foo');
      expect(comment.tags[1].tags[0].tag).to.eql('deep-tag');
      expect(comment.tags[1].tags[0].name).to.eql('bar');

      done();
    })
  });

});
