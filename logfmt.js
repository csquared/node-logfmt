var _                = require('lodash');
var bodyParser       = require('./lib/body_parser');
var bodyParserStream = require('./lib/body_parser_stream');
var logfmtParser     = require('./lib/logfmt_parser');
var logger           = require('./lib/logger');
var requestLogger    = require('./lib/request_logger');

function logfmt(stream, defaultData, timer) {
  this.stream = stream || process.stdout;
  this.defaultData = defaultData || {};
  if(timer){
    this.timerKey = timer.key;
    this.timerNow = timer.now;
  }
  this.maxErrorLines = 10;
}

_.extend(logfmt.prototype, logger);

logfmt.prototype.parse = logfmtParser.parse;

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
  return bodyParserStream({ contentType: mime, parser: this.parse });
};

logfmt.prototype.requestLogger = function(options, formatter) {
  return requestLogger.init(this, options, formatter);
};

logfmt.prototype.requestLogger.commonFormatter = requestLogger.commonFormatter;

_.extend(logfmt, logfmt.prototype);
module.exports = logfmt;
logfmt.call(module.exports)
