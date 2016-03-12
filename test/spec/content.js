var expect = require('chai').expect
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse content elements',
    function(done) {
      var source = 'test/fixtures/content.js'
        , stream = parse.load(source)
        , comments = [];

      stream.on('comment', function(comment) {
        comments.push(comment);
      })

      stream.on('finish', function() {
        expect(comments.length).to.eql(3);
        expect(comments[0].description).to.eql('foo opt');
        expect(comments[1].description).to.eql('bar opt');
        expect(comments[2].description).to.eql('final comment');
        done();
      })
    }
  );

});
