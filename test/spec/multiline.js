var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block', function(done) {
    var source = 'test/fixtures/multiline.js'
      , stream = parse.file(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      //console.dir('source: ')
      //console.dir(comment.source)
      //console.dir('expected: ')
      //console.dir(expected)
      expect(comment.source).to.eql(expected);
      expect(comment.tags).to.eql([]);
      done();
    })
  });

});
