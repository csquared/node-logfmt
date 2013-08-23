var logfmt = function(){
  var parse = require('./lib/logfmt_parser').parse;

  this.parse = parse;
  this.stream = process.stdout;

  var logger = require('./lib/logger');
  this.log = logger.log;
  this.time = logger.time;
  this.namespace = logger.namespace;

  this.requestLogger = require('./lib/request_logger');

  //Syncronous Body Parser
  var bodyParser = require('./lib/body_parser')
  this.bodyParser = function(options) {
    if(options == null) options = {};
    var mime = options.contentType || "application/logplex-1"
    return bodyParser({contentType: mime, parser: parse})
  }

  //Stream Body Parser
  var bodyParserStream = require('./lib/body_parser_stream');
  this.bodyParserStream = function(options) {
    if(options == null) options = {};
    var mime = options.contentType || "application/logplex-1"
    return bodyParserStream({contentType: mime, parser: parse})
  }
}

exports = module.exports = logfmt;
logfmt.call(exports)
