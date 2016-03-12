var expect = require('chai').expect
  , parser = require('../../index');

describe('mkparse:', function() {

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

  it('should parse string w/ array of language packs', function(done) {
    var comments = [];
    function onComment(comment) {
      expect(comment).to.be.an('object');
      comments.push(comment);
    }
    function onComplete() {
      expect(comments.length).to.eql(2);
      done(); 
    }
    var stream = parser.parse(
      '# @file spec.ini\n; @module spec',
      {
        rules: [require('../../lang/shell'), require('../../lang/ini')]
      }
    );
    stream.on('comment', onComment);
    stream.on('finish', onComplete);
  });

});
