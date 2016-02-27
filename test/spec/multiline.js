var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block', function(done) {
    var source = 'test/fixtures/multiline.js'
      , stream = parse.file(source);

    stream.once('comment', function(comment) {
      console.dir(comment)
      expect(comment.source).to.be.a('string');
      expect(comment.description).to.be.a('string');
      expect(comment.line).to.be.a('number');
      expect(comment.pos).to.be.an('object');
      expect(comment.source + '\n').to.eql('' + fs.readFileSync(source));
      expect(comment.tags).to.eql([]);
      done();
    })
  });

});
