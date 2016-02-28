var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse multiline comment block w/ comment description',
    function(done) {
      var source = 'test/fixtures/multiline-comment-description.js'
        , stream = parse.file(source)
        , expected = ('' + fs.readFileSync(source)).trim()
        , desc = 'Function description.\n\nWith multiple lines.\n\n'
            + 'On separate paragraphs.';

      stream.once('comment', function(comment) {
        expect(comment.source).to.eql(expected);
        expect(comment.line).to.eql(1);
        expect(comment.pos.start).to.eql(1);
        expect(comment.pos.end).to.eql(7);
        expect(comment.description).to.eql(desc);
        done();
      })
    }
  );

});
