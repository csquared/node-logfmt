var logfmt = require('../logfmt'),
    stream = require('stream'),
    assert = require('assert');

test("body parser skips parsing when req._body is true", function(){

  var mockReq = new stream.Readable;
  mockReq.get = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  mockReq._body = true;

  var next = function(err){
    assert.equal(mockReq.body, undefined)
  };

  var parser = logfmt.bodyParser();
  parser(mockReq, null, next)
})

test("body parser skips parsing when contentType does not match", function(){
  var mockReq = new stream.Readable;
  mockReq.get = function(){
    return 'application/foo';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  var next = function(err){
    assert.equal(mockReq.body, undefined)
  };

  var parser = logfmt.bodyParser();
  parser(mockReq, null, next)

})

test("body parser accepts contentType option", function(){
  var mockReq = new stream.Readable;
  mockReq.get = function(){
    return 'foo';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  var next = function(err){
    assert.deepEqual(mockReq.body[0], {hello: 'kitty'})
  };

  var parser = logfmt.bodyParser({contentType: 'foo'});
  parser(mockReq, null, next)
})

test("body parser converts body lines to objects", function(){
  var mockReq = new stream.Readable;
  mockReq.get = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty');
  mockReq.push(null);

  var next = function(err){
    assert.deepEqual(mockReq.body[0], {hello: 'kitty'})
  };

  var parser = logfmt.bodyParser();
  parser(mockReq, null, next)
})

test("body parser parses all the lines", function(){
  var mockReq = new stream.Readable;
  mockReq.get = function(){
    return 'application/logplex-1';
  }
  mockReq._read = function(){};
  mockReq.push('hello=kitty\n');
  mockReq.push('foo=bar');
  mockReq.push(null);

  var next = function(err){
    assert.deepEqual(mockReq.body[0], {hello: 'kitty'})
    assert.deepEqual(mockReq.body[1], {foo: 'bar'})
  };

  var parser = logfmt.bodyParser();
  parser(mockReq, null, next)
})
