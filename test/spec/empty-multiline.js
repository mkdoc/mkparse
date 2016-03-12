var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse empty multiline comment block', function(done) {
    var source = 'test/fixtures/empty-multiline.js'
      , stream = parse.load(source, {trim: true});

    stream.once('comment', function(comment) {
      expect(comment.source).to.be.a('string');
      expect(comment.description).to.be.a('string');
      expect(comment.line).to.be.a('number')
        .to.eql(1);
      expect(comment.pos).to.be.an('object');
      expect(comment.tags).to.eql([]);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(3);
      done();
    })
  });

});
