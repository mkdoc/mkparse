var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block w/ multiple tags', function(done) {
    var source = 'test/fixtures/multiline-multi-tags.js'
      , stream = parse.load(source)
      , expected = ('' + fs.readFileSync(source)).trim()
      , desc = 'var foo = \'bar\'\n  , x = \'y\';';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(8);
      expect(comment.tags.length).to.eql(2);
      expect(comment.tags[0].id).to.eql('usage');
      expect(comment.tags[0].description).to.eql(desc);
      expect(comment.tags[1].id).to.eql('private');
      done();
    })
  });

});
