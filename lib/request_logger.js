var logfmt = require('../logfmt');

var commonFormatter = function(req, res){
  if((typeof req.path) == 'function'){
    //in restify path is a function
    var path = req.path();
  }
  else{
    //in express it is an attribute
    var path = req.path;
  }

  var ip = req.ip || req.header('x-forwarded-for')
                  || req.connection.remoteAddress;

  return {
    ip: ip,
    time: (new Date()).toISOString(),
    method: req.method,
    path: path,
    "status": res.statusCode,
    content_length: req.header('content-length'),
    content_type: req.header('content-type'),
  }
}


var immediateLogger = function(options, formatter){
  return function(req, res, next){
    var data = formatter(req, res);
    logfmt.log(data);
    next();
  }
}

var timingLogger = function(options, formatter){
  return function(req, res, next){
    var elapsed = options.elapsed || 'elapsed';
    logfmt.time(elapsed, function(logger) {
      var end = res.end;
      res.end = function(chunk, encoding) {
        var data = formatter(req, res);
        res.end = end;
        res.end(chunk, encoding);
        logger.log(data);
      };
      next();
    })
  }
}

exports = module.exports = function(options, formatter){
  if(!formatter && !options){
    formatter = commonFormatter;
    options = {};
  }
  else if(!formatter){
    if(typeof options == 'function'){
      formatter = options;
      options = {};
    }else{
      formatter = commonFormatter;
    }
  }
  options = options || {};

  if(options.immediate){
    return immediateLogger(options, formatter);
  }else{
    return timingLogger(options, formatter);
  }
}

exports.commonFormatter = commonFormatter;
