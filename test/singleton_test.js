var logfmt = require('../logfmt'),
    assert = require('assert');

suite('logfmt.time', function() {
  test('singleton is configured', function(){
    assert(process.stdout === logfmt.stream, 'default stream is not stdout');
    assert.equal(10, logfmt.maxErrorLines);
  })
})
