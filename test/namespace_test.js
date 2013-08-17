var logfmt = require('../logfmt'),
    assert = require('assert');

var OutStream = require('./outstream');

suite('logfmt.namespace', function() {
  test("returns a new logfmt object", function(){
    var logfmt2 = logfmt.namespace();
    var mock_sink = new OutStream;
    var data = {foo: 'bar', a: 14}
    logfmt2.log(data, mock_sink);
    assert.equal("foo=bar a=14\n", mock_sink.logline)
    var recovered = logfmt2.parse(mock_sink.logline)
    assert.deepEqual(data, recovered);
  })

  test("includes data passed in on all log lines", function(){
    var logfmt2 = logfmt.namespace({ns: 'logfmt'});
    var mock_sink = new OutStream;
    var data = {foo: 'bar', a: 14}
    logfmt2.log(data, mock_sink);
    assert.equal("foo=bar a=14 ns=logfmt\n", mock_sink.logline)
    logfmt2.log({}, mock_sink);
    assert.equal("ns=logfmt\n", mock_sink.logline)
    logfmt2.log(data, mock_sink);
    assert.equal("foo=bar a=14 ns=logfmt\n", mock_sink.logline)
  })
})
