var body_parser = require('./lib/body_parser')
var logfmt = require('./logfmt')

var logplex_body_parser = function (body) {
  var lines = []
  body.split("\n").forEach(function(line){
    lines.push(logfmt.parse(line))
  })
  return lines;
}

exports = module.exports = function() {
  return body_parser({content_type: "application/logplex-1", parser: logplex_body_parser})
}
