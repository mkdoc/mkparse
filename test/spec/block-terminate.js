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
        expect(comments[0].line).to.eql(1);
        expect(comments[0].pos.start).to.eql(1);
        expect(comments[0].pos.end).to.eql(2);
        expect(comments[1].description).to.eql(
          'This is another comment');
        expect(comments[1].line).to.eql(3);
        done();
      })
    }
  );

});
