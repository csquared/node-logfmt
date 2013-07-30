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
