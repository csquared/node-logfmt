var logfmt = require('../logfmt'),
    assert = require('assert');

suite('logfmt.serialize', function() {

  test("serialize object with properties", function(){
    var data = {}
    data.foo = 'bar';
    assert.equal('foo=bar', logfmt.serialize(data));
  })

})
