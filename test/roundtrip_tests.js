var logfmt = require('../logfmt'),
    assert = require('assert');

var mock_sink = {
  logline: '',
  write: function(string) {
    this.logline = string;
  }
}

test("key value pairs are restored", function(){
  var data = {foo: 'bar', a: 14}
  logfmt.log(data, mock_sink);
  assert.deepEqual(data, logfmt.parse(mock_sink.logline));
})

test("true and false are restored", function(){
  var data = {foo: true, bar: false}
  logfmt.log(data, mock_sink);
  assert.deepEqual(data, logfmt.parse(mock_sink.logline));
})

test("quoted strings are restored", function(){
  var data = {foo: "hello kitty"}
  logfmt.log(data, mock_sink);
  assert.deepEqual(data, logfmt.parse(mock_sink.logline))
})
