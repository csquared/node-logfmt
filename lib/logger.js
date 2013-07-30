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


exports.time = function(arg1, arg2, arg3) {
  var startTime = (new Date()).getTime();

  var label = arg1;
  var top_data = arg2 || {};
  var callback = arg3;

  if(!arg2){
    label = 'elapsed';
    callback = arg1;
  }
  else if(!arg3){
    if(arg1.substring){
      label = arg1;
    }else{
      label = 'elapsed';
      top_data = arg1;
    }
    callback = arg2;
  }

  var logger = {};
  logger.log = function(data, stream){
    var now = (new Date()).getTime()
    if(!data) data = {};
    for (key in top_data) {
      data[key] = top_data[key];
    }
    data[label] = (now - startTime).toString() + 'ms' ;
    exports.log(data, stream);
  }

  return callback(logger);
}
