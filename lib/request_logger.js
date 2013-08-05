var logfmt = require('../logfmt');

var defaultFormatter = function(req, res){
  return {
    method: req.method,
    "status": res.statusCode,
    "content-type" : req.header('content-type'),
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
    formatter = defaultFormatter;
    options = {};
  }
  else if(!formatter){
    formatter = options;
    options = {};
  }
  options = options || {};

  if(options.immediate){
    return immediateLogger(options, formatter);
  }else{
    return timingLogger(options, formatter);
  }
}
