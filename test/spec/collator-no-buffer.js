var expect = require('chai').expect
  , parse = require('../../index')
  , Collator = require('../../lib/collator');

describe('collator:', function() {

  it('should collate all content and comments without buffer',
    function(done) {
      var source = 'test/fixtures/content.js'
        , stream = parse.load(source)
        , comments = []
        , collator = new Collator();

      stream.pipe(collator);

      stream.on('comment', function(comment) {
        comments.push(comment);
      })

      stream.on('finish', function() {
        //expect(collator.buffer).to.eql(expected);
        expect(comments.length).to.eql(4);
        expect(comments[0].description).to.eql('foo opt');
        expect(comments[1].description).to.eql('bar opt');
        expect(comments[2].description).to.eql('final comment');
        expect(comments[3].description).to.eql('compact comment');
        done();
      })
    }
  );

});
