//constructor
function logfmt() {
}
module.exports = logfmt;

var _                = require('lodash');
var streamParser     = require('./lib/stream_parser');
var bodyParser       = require('./lib/body_parser');
var bodyParserStream = require('./lib/body_parser_stream');
var logfmtParser     = require('./lib/logfmt_parser');
var logger           = require('./lib/logger');
var requestLogger    = require('./lib/request_logger');
var serializer       = require('./lib/stringify');

//Build up logfmt prototype
_.extend(logfmt.prototype, logger);

logfmt.prototype.stringify = serializer.stringify;
logfmt.prototype.parse = logfmtParser.parse;
logfmt.prototype.streamParser = streamParser.streamParser;

// Synchronous body parser
logfmt.prototype.bodyParser = function(options) {
  options || (options = {});
  var mime = options.contentType || "application/logplex-1";
  return bodyParser({ contentType: mime, parser: this.parse });
};

// Stream parser
logfmt.prototype.bodyParserStream = function(options) {
  options || (options = {});
  var mime = options.contentType || "application/logplex-1";
  return bodyParserStream({ contentType: mime });
};

logfmt.prototype.requestLogger = function(options, formatter) {
  return requestLogger.init(this, options, formatter);
};

logfmt.prototype.requestLogger.commonFormatter = requestLogger.commonFormatter;

_.extend(logfmt, logfmt.prototype);
