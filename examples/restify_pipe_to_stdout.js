var restify = require('restify');
var through = require('through');
var logfmt  = require('../logfmt');

var server = restify.createServer({
  name: 'logfmt-test-server'
})

server.use(logfmt.bodyParserStream());

server.post('/logs', function(req, res, next){
  req.body.pipe(through(function(line){
    console.log(JSON.stringify(line));
  }))
  res.send(200, 'OK');
  return next();
})

server.listen(3000);
