var expect = require('chai').expect
  , parse = require('../../../index');

function assert(comments) {
  expect(comments.length).to.eql(3);

  expect(comments[0].description).to.eql('File description');
  expect(comments[0].tags.length).to.eql(1);
  expect(comments[0].tags[0].id).to.eql('file');
  expect(comments[0].tags[0].name).to.eql('spec.php');


  expect(comments[1].description).to.eql('Print an error message');
  expect(comments[1].tags.length).to.eql(2);
  expect(comments[1].tags[0].id).to.eql('function');
  expect(comments[1].tags[0].name).to.eql('error');

  expect(comments[1].tags[1].id).to.eql('param');
  expect(comments[1].tags[1].name).to.eql('message');
  expect(comments[1].tags[1].type).to.eql('String');

  expect(comments[2].description).to.eql('Inline comment');
}

describe('cparse:', function() {

  it('should use php language', function(done) {
    var source = 'test/fixtures/lang/spec.php'
      , stream = parse.load(source, {rules: require('../../../lang/php')})
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
