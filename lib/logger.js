var _ = require('lodash');

exports.log = function(data, stream) {
  if(stream == undefined) stream = this.stream;
  var logData = _.extend({}, this.defaultData, data);

  if(this.timerNow){
    var now = (new Date()).getTime()
    logData[this.timerKey] = (now - this.timerNow).toString() + 'ms' ;
  }

  stream.write(this.stringify(logData) + "\n");
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
