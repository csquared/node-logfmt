logfmt = require('../logfmt');

exports.log = function(data, stream) {
  if(stream == undefined) stream = logfmt.stream;

  var line = '';
  Object.keys(data).forEach(function(key){
    var value = data[key].toString();
    if(value.indexOf(' ') > -1) value = '"' + value + '"';
    line += key + '=' + value + ' ';
  })

  //trim traling space and print w. newline
  stream.write(line.substring(0,line.length-1) + "\n");
}


exports.time = function(label, callback) {
  var startTime = (new Date()).getTime();
  if(!callback) {
    callback = label;
    label = 'elapsed';
  }

  var logger = {};
  logger.log = function(data, stream){
    var now = (new Date()).getTime()
    if(!data) data = {};
    data[label] = (now - startTime).toString() + 'ms' ;
    exports.log(data, stream);
  }

  return callback(logger);
}
