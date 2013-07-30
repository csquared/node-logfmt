var logfmt = require('../logfmt'),
    stream = require('stream'),
    assert = require('assert');

test("stream body parser skips parsing when req._body is true", function(){

  var mockReq = new stream.Readable;
  mockReq.header = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  mockReq._body = true;

  var next = function(err){
    assert.equal(mockReq.body, undefined)
  };

  var parser = logfmt.bodyParserStream();
  parser(mockReq, null, next)
})

test("stream body parser skips parsing when contentType does not match", function(){
  var mockReq = new stream.Readable;
  mockReq.header = function(){
    return 'application/foo';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  var next = function(err){
    assert.equal(mockReq.body, undefined)
  };

  var parser = logfmt.bodyParserStream();
  parser(mockReq, null, next)

})

test("stream body parser converts body lines to object read stream", function(done){
  var mockReq = new stream.Readable;
  mockReq.header = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);
  var next = function(){};

  var parser = logfmt.bodyParserStream();
  parser(mockReq, null, next)

  mockReq.body.on('readable', function(){
    var data = mockReq.body.read();
    assert.deepEqual(data, {hello: 'kitty'})
    done();
  })
})


test("stream body parser accepts contentType option", function(done){
  var mockReq = new stream.Readable;
  mockReq.header = function(){
    return 'foo';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);
  var next = function(){};

  var parser = logfmt.bodyParserStream({contentType: 'foo'});
  parser(mockReq, null, next)

  mockReq.body.on('readable', function(){
    var data = mockReq.body.read();
    assert.deepEqual(data, {hello: 'kitty'})
    done();
  })
})

test("body parser parses all the lines", function(done){
  var mockReq = new stream.Readable;
  mockReq.header = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty\n');
  mockReq.push('foo=bar\n');
  mockReq.push('path=/');
  mockReq.push(null);
  var next = function(){};

  var parser = logfmt.bodyParserStream();
  parser(mockReq, null, next)

  var matches = [{path: '/'}, {foo: 'bar'}, {hello: 'kitty'}];
  mockReq.body.on('readable', function(){
    var data = mockReq.body.read();
    assert.deepEqual(data, matches.pop())
    if(matches.length == 0) done();
  })
})
