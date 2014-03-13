var _ = require('lodash');

exports.log = function(data, stream) {
  if(stream == undefined) stream = this.stream;

  var line    = '';
  var logData = _.extend({}, this.defaultData, data);

  Object.keys(logData).forEach(function(key){
    var value = logData[key];
    var is_null = false;
    if(value == null) {
      is_null = true;
      value = '';
    }
    else value = value.toString();

    var needs_quoting  = value.indexOf(' ') > -1 || value.indexOf('=') > -1;
    var needs_escaping = value.indexOf('"') > -1;

    if(needs_escaping) value = value.replace(/"/g, '\\"');
    if(needs_quoting) value = '"' + value + '"';
    if(value === '' && !is_null) value = '""';

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
    if(typeof arg1  === 'function'){
      label = 'elapsed';
      callback = arg1;
    }
  }
  else if(!arg3){
    //using method detection
    if(typeof arg1 === 'string'){
      label = arg1;
      top_data = {};
    }else{
      label = 'elapsed';
      top_data = arg1;
    }
    callback = arg2;
  }

  var logger = this.namespace(top_data);
  var orig_log = logger.log;

  logger.log = function(data, stream){
    var now = (new Date()).getTime()
    data = data || {};
    data[label] = (now - startTime).toString() + 'ms' ;
    orig_log.call(this, data, stream)
  }

  if (typeof callback === 'function') {
    callback(logger);
  }

  return logger;
}

exports.namespace = function(object) {
  var logfmt = require('../logfmt');
  var namespace = _.extend({}, this.defaultData, object);
  return new logfmt(this.stream, namespace);
}

exports.error = function(err, id) {
  if (id === undefined) {
    id = Math.random().toString().slice(2, 12);
  }
  this.log({ error:true, id:id, message:err.message });
  var stack = err.stack.split('\n');
  for (var line in stack) {
    if (line >= (this.maxErrorLines || 10)) break;
    this.log({ error:true, id:id, line:line, trace:stack[line] });
  }
}
