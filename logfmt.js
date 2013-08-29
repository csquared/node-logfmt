var logfmt = function(){
  var parse = require('./lib/logfmt_parser').parse;

  this.parse = parse;
  this.stream = process.stdout;

  var logger = require('./lib/logger');
  this.log = logger.log;
  this.time = logger.time;
  this.namespace = logger.namespace;
  this.error = logger.error;

  this.requestLogger = require('./lib/request_logger');

  this.maxErrorLines = 10;

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

  var outStreamMock = require('./lib/out_stream_mock');
  this.mockStream = outStreamMock;
  this.mock = function mock(){
    this._stream = this.stream;
    this.stream = new outStreamMock();
  }

  this.unMock = function unMock(){
    this.stream = this._stream;
  }
}

exports = module.exports = logfmt;
logfmt.call(exports)
