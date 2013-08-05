# node-logfmt

"logfmt" is the name for a [key value logging convention](https://github.com/kr/logfmt) we've adopted at Heroku.

This library is for both converting lines in logfmt format to objects and
for logging objects to a stream in logfmt format.
It provides a logfmt parser, a logging facility,
and both streaming and non-streaming body parsers for express.

You should use this library if you're trying to write structured logs or
if you're consuming them (especially if you're writing a logplex drain).

## install

    npm install logfmt

# use

```javascript
var logfmt = require('logfmt');
```

## parser

### `logfmt.parse(string)`

```javascript
var logfmt = require('logfmt');

logfmt.parse("foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf code=H12")
//=>{ "foo": "bar", "a": '14', "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true, "code" : "H12" }
```

The only conversions are from the strings `true` and `false` to their proper boolean counterparts.
We cannot arbitrarily convert numbers because we will drop precision for numbers that require more than 32 bits to represent them.

## logging

### `logfmt.log(object, [stream])`

Defaults to logging to `process.stdout`

```javascript
var logfmt = require('logfmt');
logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'})
//=> foo=bar a=14 baz="hello kitty"
```

### `logfmt.time([label], [data], callback(logger))`

#### `logger.log([data], [stream])`

Log how long something takes.

- `label`: optional name for the milliseconds key (defaults to `elapsed`)
- `data`: optional extra data to include with every call to `logger.log`
- `logger`: object passed to callback with a `log` function

No args defaults to `elapsed=<milliseconds>ms`

```javascript
logfmt.time(function(logger){
  logger.log();
})
//=> elapsed=1ms
```

String `label` changes the key `<string>=<milliseconds>ms`

```javascript
logfmt.time('time', function(logger){
  logger.log();
  logger.log();
})
//=> time=1ms
//=> time=2ms
```

Data can be passed to `logger.log`

```javascript
logfmt.time(function(logger){
  logger.log({foo: 'bar'});
})
//=> foo=bar elapsed=1ms
```

Data can also be passed to `logfmt.time` and will persist
across calls to `logger.log`

```javascript
logfmt.time('thing', {foo: 'bar'}, function(logger){
  logger.log({at: 'function.start'});
  logger.log({at: 'function.end'});
})
//=> at=function.start foo=bar thing=1ms
//=> at=function.end foo=bar thing=2ms
```

You do not need a `label` to pass data to `logfmt.time`

```javascript
logfmt.time({foo: 'bar'}, function(logger){
  logger.log({at: 'function'});
})
//=> at=function foo=bar elapsed=1ms
```

### customizing logging location

`logfmt.log()` and `logger.log()` Accepts as 2nd argument anything that responds to `write(string)`
```javascript
var logfmt = require('logfmt');
logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'}, process.stderr)
//=> foo=bar a=14 baz="hello kitty"
```

Overwrite the default global location by setting `logfmt.stream`
```javascript
var logfmt = require('logfmt');
logfmt.stream = process.stderr

logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'})
//=> foo=bar a=14 baz="hello kitty"
```
## express/restify logging middleware

```javascript
app.use(logfmt.requestLogger());
//=> method=POST status=200 content-type=application/logplex-1 elapsed=4ms
```

#### `logfmt.requestLogger([options], [formatter(req, res)])

Defaults to timing the request and logging the HTTP method, status code, and content-type.

Valid Options:

- `immediate`: log before call to `next()` (ie: before the request finishes)
- `elapsed`: in non

```javascript
app.use(logfmt.requestLogger({immediate: true}, function(req, res){
  return {
    method: req.method
  }
}));
//=> method=POST
```

##### `formater(req, res)`

A formatter takes the request and response and returns a JSON object for `logfmt.log`

```javascript
app.use(logfmt.requestLogger(function(req, res){
  return {
    method: req.method
  }
}));
//=> method=POST elapsed=4ms
```

## express/restify parsing middleware

```javascript
  // streaming
  app.use(logfmt.bodyParserStream());
  // buffering
  app.use(logfmt.bodyParser());
```

### Streaming

#### `logfmt.bodyParserStream([opts])`

Valid Options:

- `contentType`: defaults to `application/logplex-1`

If you use the `logfmt.bodyParserStream()` for a body parser,
you will have a `req.body` that is a readable stream.

Pipes FTW:

```javascript
var app    = require('express')();
var http   = require('http');
var through = require('through');
var logfmt  = require('logfmt');

app.use(logfmt.bodyParserStream());

app.post('/logs', function(req, res){
  if(!req.body) return res.send('OK');

  req.body.pipe(through(function(line){
    console.dir(line);
  }))

  res.send('OK');
})

http.createServer(app).listen(3000);
```

Or you can just use the `readable` event:

```javascript
var app    = require('express')();
var http   = require('http');
var logfmt  = require('logfmt');

app.use(logfmt.bodyParserStream());

// req.body is now a Readable Stream
app.post('/logs', function(req, res){
  req.body.on('readable', function(){
    var parsedLine = req.body.read();
    if(parsedLine) console.log(parsedLine);
    else res.send('OK');
  })
})

http.createServer(app).listen(3000);
```

### Non-Streaming

#### `logfmt.bodyParser([opts])`

Valid Options:

- `contentType`: defaults to `application/logplex-1`

If you use the `logfmt.bodyParser()` for a body parser,
you will have a `req.body` that is an array of objects.

```javascript
var logfmt   = require('logfmt');

app.use(logfmt.bodyParser());

// req.body is now an array of objects
app.post('/logs', function(req, res){

  console.log('BODY: ' + JSON.stringify(req.body));

  req.body.forEach(function(data){
    console.log(data);
  });

  res.send('OK');
})

http.createServer(app).listen(3000);
```

test it:

```bash
curl -X POST --header 'Content-Type: application/logplex-1' -d "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" http://localhost:3000/logs
```

## command line

### logfmt

accepts lines on STDIN and converts them to json


    > echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }

### logfmt -r (reverse)

accepts JSON on STDIN and converts them to logfmt

    > echo '{ "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }' | logfmt -r
    foo=bar a=14 baz="hello kitty" cool%story=bro f=true %^asdf=true

    > echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt | logfmt -r | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }
