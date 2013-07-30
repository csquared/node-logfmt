var restify = require('restify');
var logfmt  = require('../logfmt');

var server = restify.createServer({
  name: 'logfmt-test-server'
})

server.use(logfmt.bodyParser());

server.post('/logs', function(req, res, next){
  req.body.forEach(function(line){
    console.log(JSON.stringify(line));
  })
  res.send(200, 'OK');
  return next();
})

server.listen(3000);
