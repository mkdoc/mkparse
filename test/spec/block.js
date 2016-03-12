var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse single-line comment block', function(done) {
    var source = 'test/fixtures/block.js'
      , stream = parse.load(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.description)
        .to.eql('This is a multi-line \ndescription');
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(2);
      expect(comment.tags).to.eql([]);
      done();
    })
  });

});
