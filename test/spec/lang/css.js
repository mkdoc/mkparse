var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {
  expect(comments.length).to.eql(3);

  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.css');


  expect(comments[1].description).to.eql('1em = 10px');

  expect(comments[2].description).to.eql('Styles for the slider component.');
  expect(comments[2].tags.length).to.eql(1);
  expect(comments[2].tags[0].id).to.eql('component');
  expect(comments[2].tags[0].name).to.eql('slider');
}

describe('cparse:', function() {

  it('should use css language', function(done) {
    var source = 'test/fixtures/lang/spec.css'
      , stream = parse.load(source, {rules: require('../../../lang/css')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      assert(comments);
      done();
    })
  });

  it('should use css language w/ options', function(done) {
    var source = 'test/fixtures/lang/spec.css'
      , stream = parse.load(
          source, {
            rules: require('../../../lang/css'),
            options: {single: false, multi: {greedy: true}}})
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
