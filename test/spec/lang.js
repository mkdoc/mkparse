var expect = require('chai').expect
  , lang = require('../../lang');

describe('mkparse:', function() {

  it('should have language index', function(done) {
    expect(lang).to.be.an('object');
    expect(lang.map).to.be.an('object');
    expect(lang.ext).to.be.an('object');
    expect(lang.load).to.be.a('function');
    expect(lang.exists).to.be.a('function');
    done();
  });

  it('should test language exists', function(done) {
    expect(lang.exists('non-existent')).to.eql(false);
    expect(lang.exists('actionscript')).to.eql(true);
    done();
  });

  it('should load language pack', function(done) {
    expect(lang.load('actionscript')).to.be.a('function');
    done();
  });

  it('should error on load invalid language', function(done) {
    function fn() {
      lang.load('non-existent');
    }
    expect(fn).throws(/unknown language pack/i);
    done();
  });

});
