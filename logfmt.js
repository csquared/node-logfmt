exports.parse  = require('./lib/logfmt_parser').parse;

exports.stream = process.stdout;

exports.log = function(data, stream) {
  if(stream == undefined) stream = exports.stream;

  var line = '';
  Object.keys(data).forEach(function(key){
    var value = data[key].toString();
    if(value.indexOf(' ') > -1) value = '"' + value + '"';
    line += key + '=' + value + ' ';
  })

  //trim traling space and print w. newline
  stream.write(line.substring(0,line.length-1) + "\n");
}
