var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse multiple multiline comment blocks w/ trailing start (//)',
    function(done) {
      var source = 'test/fixtures/multiple-trailing-single.js'
        , stream = parse.load(source)
        , expected = 'Description text'
        , comments = [];

      stream.on('comment', function(comment) {
        comments.push(comment);
      })

      stream.on('finish', function() {
        expect(comments.length).to.eql(2);
        expect(comments[0].description).to.eql(expected);

        expect(comments[1].description).to.eql('');
        expect(comments[1].tags.length).to.eql(1);
        expect(comments[1].tags[0].id).to.eql('param');
        expect(comments[1].tags[0].name).to.eql('opts');
        expect(comments[1].tags[0].description).to.eql('request options');
        done();
      });
    }
  );

});
