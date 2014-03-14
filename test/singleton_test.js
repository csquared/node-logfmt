var logfmt = require('../logfmt'),
    assert = require('assert');

suite('logfmt singleton', function() {
  test('stream is configured', function(){
    assert(process.stdout === logfmt.stream, 'default stream is not stdout');
  })

  test('maxErrorLines is configured', function(){
    assert.equal(10, logfmt.maxErrorLines);
  })
})
