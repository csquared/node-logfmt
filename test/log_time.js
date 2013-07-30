var logfmt = require('../logfmt'),
    assert = require('assert');

var mock_sink = {
  logline: '',
  write: function(string) {
    this.logline = string;
  }
}

test("logs the time", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(logger){
    logger.log();
    var actual = mock_sink.logline;
    assert(/^elapsed=\dms\n$/.test(actual), actual)
    done();
  })
})

test("logs the time with your label", function(done){
  logfmt.stream = mock_sink;
  logfmt.time('time', function(logger){
    logger.log();
    var actual = mock_sink.logline;
    assert(/^time=\dms\n$/.test(actual), actual)
    done();
  })
})

test("milliseconds", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(logger){
    var wrapped = function() {
      logger.log();
      var actual = mock_sink.logline;
      assert(/^elapsed=2\dms\n$/.test(actual), actual)
      done();
    }
    setTimeout(wrapped, 20);
  })
})

test("logs the time with your label and data", function(done){
  logfmt.stream = mock_sink;
  logfmt.time('time', function(logger){
    logger.log({foo: 'bar'});
    var actual = mock_sink.logline;
    assert(/^foo=bar time=\dms\n$/.test(actual), actual)
    done();
  })
})

test("supports log(data, stream) interface", function(done){
  logfmt.time(function(logger){
    logger.log({foo: 'bar'}, mock_sink);
    var actual = mock_sink.logline;
    assert(/^foo=bar elapsed=\dms\n$/.test(actual), actual)
    done();
  })
})

test("can log twice", function(done){
  logfmt.time(function(logger){
    logger.log({foo: 'bar'}, mock_sink);
    var actual = mock_sink.logline;
    assert(/^foo=bar elapsed=\dms\n$/.test(actual), actual)
    var wrapped = function() {
      logger.log({bar: 'foo'});
      var actual = mock_sink.logline;
      assert(/^bar=foo elapsed=2\dms\n$/.test(actual), actual)
      done();
    }
    setTimeout(wrapped, 20);
  })
})
