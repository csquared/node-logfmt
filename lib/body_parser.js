
/*
Module dependencies.
*/

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

  return function(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};
    var is_mime = req.get('content-type') === options.contentType;
    if (!is_mime) return next();
    req._body = true;
    var buf;
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
  };
};
