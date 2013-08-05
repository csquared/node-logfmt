var logfmt = require('../logfmt');

var default_logger = function(req, res){
  return {
    method: req.method,
    "status": res.statusCode,
    "content-type" : req.header('content-type'),
  }
}

exports = module.exports = function(options, formatter){

  if(!formatter && !options){
    formatter = default_logger;
    options = {};
  }
  else if(!formatter){
    formatter = options;
    options = {};
  }
  options = options || {};

  return function(req, res, next){
    if(options.immediate){
      var data = formatter(req, res);
      logfmt.log(data);
      next();
    }else{
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
}
