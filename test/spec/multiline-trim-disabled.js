var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse tag description w/ trim disabled (multiline)',
    function(done) {
      var source = 'test/fixtures/multiline-trim-disabled.js'
        , stream = parse.load(source, {trim: false})
        , expected = ('' + fs.readFileSync(source)).trim()
        , desc = '\nComment with leading and trailing whitespace (newline).\n'
        , tag = '\nvar x = \'y\';\n';

      stream.once('comment', function(comment) {
        expect(comment.source).to.eql(expected);
        expect(comment.line).to.eql(1);
        expect(comment.pos.start).to.eql(1);
        expect(comment.pos.end).to.eql(7);
        expect(comment.description).to.eql(desc);
        expect(comment.tags.length).to.eql(1);
        expect(comment.tags[0].description).to.eql(tag);
        done();
      })
    }
  );

});
