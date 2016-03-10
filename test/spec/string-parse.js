var expect = require('chai').expect
  , parser = require('../../index');

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

  it('should parse string w/ language pack (flush)', function(done) {
    function complete(comment) {
      expect(comment).to.be.an('object');
      done(); 
    }
    var stream = parser.parse(
      '# @file spec.rb', {rules: require('../../lang/ruby')});
    stream.on('comment', complete);
  });

});
