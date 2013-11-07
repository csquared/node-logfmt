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
    content_length: res.get('content-length'),
    content_type: res.get('content-type'),
  }
}


var immediateLogger = function(logger, options, formatter){
  return function(req, res, next){
    var data = formatter(req, res);
    logger.log(data);
    next();
  }
}

var timingLogger = function(logger, options, formatter){
  return function(req, res, next){
    var elapsed = options.elapsed || 'elapsed';
    logger.time(elapsed, function(logger) {
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

exports.init = function(logger, options, formatter) {
  this.logger = logger;

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
    return immediateLogger(logger, options, formatter);
  }else{
    return timingLogger(logger, options, formatter);
  }
}

exports.commonFormatter = commonFormatter;
