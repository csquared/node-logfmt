var logfmt = require('./logfmt');

logfmt.time(function(callback){
  console.log('hello1')
  callback();
})

logfmt.time(function(callback){
  var wrapped = function() {
    console.log('hello2')
    callback('time_elapsed');
  }
  setTimeout(wrapped, 1000);
})

logfmt.time(function(callback){
  console.log('hello')
  callback('time_elapsed', {foo: 'bar'});
})
