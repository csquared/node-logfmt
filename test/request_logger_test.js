var logfmt = require('../logfmt'),
    assert = require('assert');

var OutStream = require('./outstream');

suite('logfmt.requestLogger', function(){
  setup(function(){
    logfmt.stream = new OutStream;
  })

  test("empty default logs method, status, and elapsed", function(done){
    var mockReq = {method: 'GET'}
    mockReq.header = function(){
      return 'foo';
    }
    var mockRes = {statusCode: 200}
    mockRes.end = function(data, encoding){}
    var next = function(){
      assert.equal('', logfmt.stream.logline);
    };
    var logger = logfmt.requestLogger();
    logger(mockReq, mockRes, next)
    mockRes.end()
    var expectation = /method=GET status=200 content-type=foo elapsed=\dms\n/
    var actual = logfmt.stream.logline;
    assert(expectation.test(actual), actual);
    done();
  })

  test("timing logs on res.end()", function(done){
    var mockReq = {method: 'GET'}
    var mockRes = {statusCode: 200}
    mockRes.end = function(data, encoding){}
    var next = function(){
      assert.equal('', logfmt.stream.logline);
    };

    var logger = logfmt.requestLogger(function(req,res){
      return {
        method: req.method,
        "status": res.statusCode
      }
    });
    logger(mockReq, mockRes, next)
    mockRes.end()
    var expectation = /method=GET status=200 elapsed=\dms\n/
    var actual = logfmt.stream.logline;
    assert(expectation.test(actual), actual);
    done();
  })

  test("immediate option logs before next()", function(done){
    var mockReq = {method: 'GET'}
    var mockRes = {statusCode: 200}
    var next = function(){
      assert.equal('method=GET status=200\n', logfmt.stream.logline);
    };

    var logger = logfmt.requestLogger({immediate: true}, function(req,res){
      return {
        method: req.method,
        "status": res.statusCode
      }
    });
    logger(mockReq, mockRes, next)
    done()
  })

  test("elapsed option renames elapsed key", function(done){
    var mockReq = {method: 'GET'}
    var mockRes = {statusCode: 200}
    mockRes.end = function(data, encoding){}
    var next = function(){
      assert.equal('', logfmt.stream.logline);
    };

    var logger = logfmt.requestLogger({elapsed: 'time'}, function(req,res){
      return {
        method: req.method,
        "status": res.statusCode
      }
    });
    logger(mockReq, mockRes, next)
    mockRes.end()
    var expectation = /method=GET status=200 time=\dms\n/
    var actual = logfmt.stream.logline;
    assert(expectation.test(actual), actual);
    done()
  })

})
