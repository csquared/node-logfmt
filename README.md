# node-logfmt

"logfmt" is the name for a [key value logging convention](https://github.com/kr/logfmt) we've adopted at Heroku.

This library is for both logging object to logfmt format and converting
lines in logfmt format to objects.  It provides a parser, a simple log
method, and both streaming and non-streaming body parsers for express.

You should use this library if you're trying to write structured logs or
if you're consuming them (especially if you're writing a logplex drain).

## install

    npm install logfmt

# use

```javascript
var logfmt = require('logfmt');
```

## logging

### `logfmt.log()`

Defaults to logging to `process.stdout`

```javascript
var logfmt = require('logfmt');
logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'})
//=> foo=bar a=14 baz="hello kitty"
```

### customizing logging location

`log()` Accepts as 2nd arg anything that responds to `write(string)`
```javascript
var logfmt = require('logfmt');
logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'}, process.stderr)
//=> foo=bar a=14 baz="hello kitty"
```

Overwrite the default location by setting `.stream`
```javascript
var logfmt = require('logfmt');
logfmt.stream = process.stderr

logfmt.log({ "foo": "bar", "a": 14, baz: 'hello kitty'})
//=> foo=bar a=14 baz="hello kitty"
```


## parser

### `logfmt.parse()`

```javascript
var logfmt = require('logfmt');

logfmt.parse("foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf code=H12")
//=>{ "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true, "code" : "H12" }
```

### express middleware

#### Streaming

##### `logfmt.bodyParserStream(opts)`

    Valid Options:
      contentType: defaults to 'application/logplex-1'

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

#### Non-Streaming

##### `logfmt.bodyParser(opts)`

    Valid Options:
      contentType: defaults to 'application/logplex-1'

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

### command line

accepts lines on STDIN and converts them to json


    echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }

#### reverse

accepts JSON on STDIN and converts them to logfmt

    echo '{ "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }' | logfmt -r
    foo=bar a=14 baz="hello kitty" cool%story=bro f=true %^asdf=true

    echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt | logfmt -r | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }
