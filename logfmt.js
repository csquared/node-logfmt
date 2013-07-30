var parse = require('./lib/logfmt_parser').parse;

exports.parse = parse;
exports.stream = process.stdout;

var logger = require('./lib/logger');
exports.log = logger.log;
exports.time = logger.time;

//Syncronous Body Parser
var bodyParser = require('./lib/body_parser')

var logfmtBodyParser = function (body) {
  var lines = []
  body.split("\n").forEach(function(line){
    lines.push(parse(line))
  })
  return lines;
}

exports.bodyParser = function(options) {
  if(options == null) options = {};
  var mime = options.contentType || "application/logplex-1"
  return bodyParser({contentType: mime, parser: logfmtBodyParser})
}

//Stream Body Parser
var bodyParserStream = require('./lib/body_parser_stream');

exports.bodyParserStream = function(options) {
  if(options == null) options = {};
  var mime = options.contentType || "application/logplex-1"
  return bodyParserStream({contentType: mime, parser: parse})
}

