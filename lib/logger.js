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


exports.time = function(timed_func) {
  var startTime = (new Date()).getTime();
  var our_callback = function(label, data){
    //using function detection
    if(!data && label && !label.substring){
      data = label;
      label = null;
    }
    if(!data) data = {};
    if(!label) label = 'elapsed';
    var now = (new Date()).getTime()
    data[label] = now - startTime;
    exports.log(data);
  }

  return timed_func(our_callback);
}
