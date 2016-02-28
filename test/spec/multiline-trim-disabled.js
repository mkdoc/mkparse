var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse tag description w/ trim disabled (multiline)',
    function(done) {
      var source = 'test/fixtures/multiline-trim-disabled.js'
        , stream = parse.file(source, {trim: false})
        , expected = ('' + fs.readFileSync(source)).trim()
        , desc = '\nComment with leading and trailing whitespace (newline).\n';

      stream.once('comment', function(comment) {
        expect(comment.source).to.eql(expected);
        expect(comment.line).to.eql(1);
        expect(comment.pos.start).to.eql(1);
        expect(comment.pos.end).to.eql(3);
        expect(comment.description).to.eql(desc);
        done();
      })
    }
  );

});
