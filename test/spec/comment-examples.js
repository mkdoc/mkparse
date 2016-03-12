var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should have equal descriptions (comment examples)',
    function(done) {
      var source = 'test/fixtures/comment-examples.js'
        , stream = parse.load(source)
        , expected = 'Comment description';

      stream.on('comment', function(comment) {
        expect(comment.description).to.eql(expected);
      })

      stream.on('finish', function() {
        done();
      })
    }
  );

});
