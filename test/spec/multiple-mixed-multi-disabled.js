var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiple mixed comment blocks on '
    + 'same line w/ multi disabled',

    function(done) {
      var source = 'test/fixtures/multiple-mixed.js'
        , stream = parse.load(source, {options: {multi: false}})
        , expected = 'request options'
        , comments = [];

      stream.on('comment', function(comment) {
        comments.push(comment);
      })

      stream.on('finish', function() {
        expect(comments.length).to.eql(1);
        expect(comments[0].description).to.eql('');
        expect(comments[0].tags.length).to.eql(1);
        expect(comments[0].tags[0].id).to.eql('param');
        expect(comments[0].tags[0].name).to.eql('opts');
        expect(comments[0].tags[0].description).to.eql(expected);
        done();
      });
    }
  );

});
