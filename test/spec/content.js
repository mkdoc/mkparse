var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse content elements',
    function(done) {
      var source = 'test/fixtures/content.js'
        , stream = parse.load(source)
        , comments = []
        , parts = []
        , expected = '' + fs.readFileSync(source);

      stream.on('comment', function(comment) {
        comments.push(comment);
        parts.push(comment);
      })

      stream.on('content', function(lines) {
        if(typeof lines === 'string') {
          parts.push(lines); 
        }else{
          parts = parts.concat(lines);
        }
      })

      stream.on('finish', function() {
        var str = '';
        parts = parts.map(function(item) {
          if(item.source) {
            str += item.source; 
            if(item.newline) {
              str += '\n'; 
            }
          }else if(item){
            str += item;
          // empty string
          }else{
            str += '\n';
          }
          return item;
        })

        //console.dir(parts)
        //console.dir(str)

        expect(str).to.eql(expected);

        //console.dir(comments)

        expect(comments.length).to.eql(4);
        expect(comments[0].description).to.eql('foo opt');
        expect(comments[1].description).to.eql('bar opt');
        expect(comments[2].description).to.eql('final comment');
        expect(comments[3].description).to.eql('compact comment');
        done();
      })
    }
  );

});
