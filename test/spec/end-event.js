var parse = require('../../index');

describe('cparse:', function() {

  it('should emit end event', function(done) {
    var source = 'test/fixtures/multiline.js'
      , stream = parse.load(source)
   
    // listen for end on the parser
    stream.once('end', done);

    // call stringify so the parser readable side is
    // consumed otherwise the `end` event will not fire
    stream.stringify();
  });

});
