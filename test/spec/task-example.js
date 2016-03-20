var expect = require('chai').expect
  , parse = require('../../index');

describe('mkparse:', function() {

  // NOTE: this test was written for a highWaterMark issue
  it('should parse @task tags', function(done) {
    var source = 'test/fixtures/task-example.js'
      , stream = parse.load(source)
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      expect(comments).to.be.an('array');
      expect(comments.length).to.eql(3);
      done();
    })

  });

});
