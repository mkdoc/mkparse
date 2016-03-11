var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {
  expect(comments.length).to.eql(3);

  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.pandoc.md');
  expect(comments[1].description).to.eql('Abstract');
  expect(comments[2].description).to.eql('Meta data');
}

describe('cparse:', function() {

  it('should use markdown language w/ pandoc variant', function(done) {
    var source = 'test/fixtures/lang/spec.pandoc.md'
      , stream = parse.load(source, {rules: require('../../../lang/pandoc')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      assert(comments);
      done();
    })
  });

});
