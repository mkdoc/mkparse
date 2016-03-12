var parse = require('../../index');

describe('mkparse:', function() {

  it('should emit finish event', function(done) {
    var source = 'test/fixtures/multiline.js'
      , stream = parse.load(source);
    stream.once('finish', done);
  });

});
