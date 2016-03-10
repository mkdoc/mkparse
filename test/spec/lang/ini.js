var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {

  expect(comments.length).to.eql(2);
  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.ini');

  expect(comments[1].description).to.eql('Set a property value');
  expect(comments[1].tags.length).to.eql(2);
  expect(comments[1].tags[0].id).to.eql('property');
  expect(comments[1].tags[0].name).to.eql('prop');
  expect(comments[1].tags[1].id).to.eql('default');
  expect(comments[1].tags[1].name).to.eql('value');
}

describe('cparse:', function() {

  it('should use ini language', function(done) {
    var source = 'test/fixtures/lang/spec.ini'
      , stream = parse.load(
          source, {rules: require('../../../lang/ini')})
      , comments = [];

    stream.on('comment', function(comment) {
      comments.push(comment);
    })

    stream.on('finish', function() {
      assert(comments);
      done();
    })
  });

  it('should use ini language w/ options', function(done) {
    var source = 'test/fixtures/lang/spec.ini'
      , stream = parse.load(
          source, {
            rules: require('../../../lang/ini'),
            options: {mark: /;+/, trail: /\s*;+.*$/}})
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
