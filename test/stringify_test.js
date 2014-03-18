var logfmt = require('../logfmt'),
    assert = require('assert');

suite('logfmt.stringify', function() {

  test("stringify object with properties", function(){

  })

  test("stringify object with properties", function(){
    var data = {}
    data.foo = 'bar';
    assert.equal('foo=bar', logfmt.stringify(data));
  })

  test("stringify object with inherited properties", function(){
    var defaults = {foo: 42, bar: "abc"}
    var options = Object.create(defaults)
    options.foo = 13
    assert.equal('foo=13 bar=abc', logfmt.stringify(options));
  })

  test("stringify true", function(){
    var data = {foo: true}
    assert.equal('foo=true', logfmt.stringify(data));
  })

  /*
  test("stringify annoying strings", function(){
    var data = {foo: '\"'}
    console.log(logfmt.stringify(data));
    //assert.equal('foo=true',
  })
  */
})
