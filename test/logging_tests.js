var logfmt = require('../logfmt'),
    assert = require('assert');

var mock_sink = {
  logline: '',
  write: function(string) {
    this.logline = string;
  }
}

test("logs simple key value pairs", function(){
  var data = {foo: 'bar', a: 14}
  logfmt.log(data, mock_sink);
  assert.equal("foo=bar a=14\n", mock_sink.logline)
})

test("logs true and false as strings", function(){
  var data = {foo: true, bar: false}
  logfmt.log(data, mock_sink);
  assert.equal("foo=true bar=false\n", mock_sink.logline)
})

test("quotes strings with spaces in them", function(){
  var data = {foo: "hello kitty"}
  logfmt.log(data, mock_sink);
  assert.equal("foo=\"hello kitty\"\n", mock_sink.logline)
})

test("setting sink at object level", function(){
  var data = {foo: "hello kitty"}
  var sink = logfmt.sink;
  logfmt.stream = mock_sink;
  logfmt.log(data);
  assert.equal("foo=\"hello kitty\"\n", mock_sink.logline)
  logfmt.stream = sink;
})

test(".time logs the time", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(callback){
    callback();
    assert(/^elapsed=\d\n$/.test(mock_sink.logline))
    done();
  })
})

test(".time(label) logs the time with your label", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(callback){
    callback('time');
    var actual = mock_sink.logline;
    assert(/^time=\d\n$/.test(actual), actual)
    done();
  })
})

test(".time(label, data) logs the time with your label and data", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(callback){
    callback('time', {foo: 'bar'});
    var actual = mock_sink.logline;
    assert(/^foo=bar time=\d\n$/.test(actual), actual)
    done();
  })
})

test(".time(data) logs the time with your data", function(done){
  logfmt.stream = mock_sink;
  logfmt.time(function(callback){
    callback({foo: 'bar'});
    var actual = mock_sink.logline;
    assert(/^foo=bar elapsed=\d\n$/.test(actual), actual)
    done();
  })
})
