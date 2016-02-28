var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse empty singleline comment block', function(done) {
    var source = 'test/fixtures/empty-singleline.js'
      , stream = parse.file(source);

    stream.once('comment', function(comment) {
      expect(comment.source).to.be.a('string');
      expect(comment.description).to.be.a('string');
      expect(comment.line).to.be.a('number')
        .to.eql(1);
      expect(comment.pos).to.be.an('object');
      expect(comment.tags).to.eql([]);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(1);
      done();
    })
  });

});
