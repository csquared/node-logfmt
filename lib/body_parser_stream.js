var split = require('split');
var through = require('through');
var Readable = require('stream').Readable;
var logfmt   = require('../logfmt');

exports = module.exports = function(options){
  if(options == null) options = {};
  var mime = options.contentType || "application/logplex-1";

  return function(req, res, next) {
    //setup
    if (req._body) return next();
    var is_mime = req.header('content-type') === mime;
    if (!is_mime) return next();
    req._body = true;

    //define Readable body Stream
    req.body = new Readable({ objectMode: true });
    req.body._read = function(n) {
      req.body._paused = false;
    };

    function parseLine(line) {
      if(!req.body._paused) req.body._paused = !req.body.push(line);
    }
    function end() { req.body.push(null); }

    function trimNewline(line) {
      return line.replace(/\r?\n/, '');
    }

    req.pipe(logfmt.streamParser()).pipe(through(parseLine, end));

    return next();
  }
}

