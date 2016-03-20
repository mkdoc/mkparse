var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  it('should parse mk @task tags', function(done) {
    var source = 'test/fixtures/mkdoc-example.js'
      , stream = parse.load(source, function() {
          expect(comments).to.be.an('array');
          expect(comments.length).to.eql(3);
          done();
        })
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

  });

});
