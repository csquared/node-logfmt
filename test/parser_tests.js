var logfmt = require('../logfmt'),
    assert = require('assert');

var test_string = "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf ";
test_string += "code=H12 path=/hello/user@foo.com/close";

test("readme string parses", function(){

  var result = logfmt.parse(test_string)
  assert.equal( "H12", result["code"])
  assert.equal( "bar", result["foo"])
  assert.equal(14, result.a)
  assert.equal("hello kitty", result['baz'])
  assert.equal('bro', result['cool%story'])
  assert.equal(true, result.f)
  assert.equal(true, result['%^asdf'])
  assert.equal('/hello/user@foo.com/close', result['path'])
})
