var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block w/ flag tag', function(done) {
    var source = 'test/fixtures/multiline-flag.js'
      , stream = parse.file(source);

    stream.once('comment', function(comment) {
      expect(comment.source + '\n').to.eql('' + fs.readFileSync(source));
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].tag).to.eql('private');
      done();
    })
  });

});
