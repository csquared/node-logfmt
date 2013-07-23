var parse = require('./lib/logfmt_parser').parse;

exports.parse = parse;

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

try {
  //this will fail if express is not on the require path
  var body_parser = require('./lib/body_parser')

  var logplex = function (body) {
    var lines = []
    body.split("\n").forEach(function(line){
      lines.push(parse(line))
    })
    return lines;
  }

  exports.bodyParser = function() {
    return body_parser({content_type: "application/logplex-1", parser: logplex})
  }
}
catch(e){
  //no express defined
}
