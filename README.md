# node-logfmt

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

Requires `express` to be installed

```javascript
var logfmt   = require('logfmt-body-parser');

app.use(logfmt());

// req.body is now an array of objects
app.post('/logs', function(req, res){

  console.log('BODY: ' + JSON.stringify(req.body));

  req.body.forEach(function(data){
    console.log(data);
  });

  res.send('OK');
})

app.listen(3000)
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

## caveats

I use a regex and haven't optimized much for performance yet.
