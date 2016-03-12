var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse single-line comment block (terminated w/ inline comment)',
    function(done) {
      var source = 'test/fixtures/block-terminate.js'
        , stream = parse.load(source)
        , comments = [];

      stream.on('comment', function(comment) {
        comments.push(comment);
      })

      stream.on('finish', function() {
        expect(comments.length).to.eql(2);
        expect(comments[0].description).to.eql(
          'This is a multi-line \ndescription');
        expect(comments[1].description).to.eql(
          'This is another comment');
        done();
      })
    }
  );

});
