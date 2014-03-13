var _ = require('lodash');

exports.log = function(data, stream) {
  if(stream == undefined) stream = this.stream;

  var line    = '';
  var logData = _.extend({}, this.defaultData, data);

  if(this.timerNow){
    var now = (new Date()).getTime()
    logData[this.timerKey] = (now - this.timerNow).toString() + 'ms' ;
  }

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

exports.time = function(label) {
  var logfmt = require('../logfmt');
  var startTime = (new Date()).getTime();
  var label  = label || 'elapsed';
  var timer  = new logfmt(this.stream, this.defaultData,
                          {key: label, now: startTime});
  return timer;
}

exports.namespace = function(object) {
  var logfmt = require('../logfmt');
  var namespace  = _.extend({}, this.defaultData, object);
  var namespaced = new logfmt(this.stream, namespace,
                          {key: this.timerKey, now: this.timerNow});
  return namespaced;
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
