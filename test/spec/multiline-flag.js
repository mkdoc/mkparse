var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block w/ flag tag', function(done) {
    var source = 'test/fixtures/multiline-flag.js'
      , stream = parse.load(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(3);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].id).to.eql('private');
      done();
    })
  });

});
