var parser = require('../../index');

describe('cparse:', function() {

  it('should parse string input w/ callback', function(done) {
    function complete() {
      done(); 
    }
    parser.parse('/**foo*/', complete);
  });

  it('should parse string input w/ listener', function(done) {
    function complete() {
      done(); 
    }
    var stream = parser.parse('/**foo*/');
    stream.on('finish', complete);
  });

});
