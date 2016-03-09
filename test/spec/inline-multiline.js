var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse inline multiline comment block', function(done) {
    var source = 'test/fixtures/inline-multiline.js'
      , stream = parse.load(source)
      , expected = '/** @param {Object} opts request options */';

    stream.once('comment', function(comment) {
      console.dir(comment);
      expect(comment.source).to.eql(expected);
      //expect(comment.line).to.eql(1);
      //expect(comment.pos.start).to.eql(1);
      //expect(comment.pos.end).to.eql(3);
      //expect(comment.tags).to.eql([]);
      done();
    })
  });

});
