var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse multiline comment block', function(done) {
    var source = 'test/fixtures/multiline.js'
      , stream = parse.load(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      //console.dir(comment);
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(3);
      expect(comment.tags).to.eql([]);
      done();
    })
  });

});
