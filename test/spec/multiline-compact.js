var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block on single line', function(done) {
    var source = 'test/fixtures/multiline-compact.js'
      , stream = parse.file(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(1);
      expect(comment.description).to.eql('Compact description');
      done();
    })
  });

});
