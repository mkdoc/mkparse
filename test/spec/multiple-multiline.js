var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiple multiline comment blocks on same line',
    function(done) {
      var source = 'test/fixtures/multiple-multiline.js'
        , stream = parse.load(source)
        , expected = 'Description text'
        , comments = [];

      stream.on('comment', function(comment) {
        comments.push(comment);
        console.dir(comment)
      })

      stream.on('finish', function() {
        expect(comments.length).to.eql(2);
        expect(comments[0].description).to.eql(expected);
        done();
      });
    }
  );

});
