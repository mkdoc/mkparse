var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should concat short tag description w/ additional lines',
    function(done) {
      var source = 'test/fixtures/tag-description-concat.js'
        , stream = parse.load(source)
        , expected = ('' + fs.readFileSync(source)).trim()
        , desc = 'Perform some operation, then try:\n\nvar x = \'y\';';

      stream.once('comment', function(comment) {
        expect(comment.source).to.eql(expected);
        expect(comment.line).to.eql(1);
        expect(comment.pos.start).to.eql(1);
        expect(comment.pos.end).to.eql(5);
        expect(comment.tags.length).to.eql(1);
        expect(comment.tags[0].description).to.eql(desc);
        done();
      })
    }
  );

});
