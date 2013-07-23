#! /usr/bin/env node

var logfmt = require('../logfmt');


var args = process.argv.slice(2);
var n = parseInt(args[0]);


console.log('' + n + ' lines');

var time = new Date().getTime();
for(i = 0; i < n; i ++){
  var test_string = "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf code=H12";
  logfmt.old_parse(test_string)
}
console.log('parse: ' + (new Date().getTime() - time) + 'ms');

var time = new Date().getTime();
for(i = 0; i < n; i ++){
  var test_string = "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf code=H12";
  logfmt.parse(test_string)
}
console.log('parse2: ' + (new Date().getTime() - time) + 'ms');
