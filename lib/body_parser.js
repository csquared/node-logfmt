
/*
Module dependencies.
*/

/*
noop middleware.
*/

var noop, utils, _limit;

noop = function(req, res, next) {
  return next();
};

utils = require("express/node_modules/connect/lib/utils");

_limit = require("express/node_modules/connect/lib/middleware/limit");

/*
JSON:

Parse logplex request bodies, providing the
parsed object as `req.body`.

Options: none

@param content_type {String} use when Content-Type matches this string
@param parser {Function} parsing function takes String body and returns new body
@return {Function}
@api public
*/

exports = module.exports = function(options) {
  var limit;
  if (options == null) options = {};
  limit = (options.limit ? _limit(options.limit) : noop);

  return function(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};
    if (!utils.hasBody(req)) return next();
    if (options.content_type !== utils.mime(req)) return next();
    req._body = true;
    var logplex = limit(req, res, function(err) {
      var buf;
      if (err) return next(err);
      buf = "";
      req.setEncoding("utf8");
      req.on("data", function(chunk) {
        return buf += chunk;
      });
      req.on("end", function() {
        var first;
        first = buf.trim();
        try {
          req.body = options.parser(buf);
        } catch (err) {
          err.body = buf;
          err.status = 400;
          return next(err);
        }
        return next();
      });
    });
    return logplex;
  };
};
