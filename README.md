# node-logfmt

## install

    npm install logfmt

## use

### straight up

```javascript
var logfmt = require('logfmt');

logfmt.parse("foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf code=H12")
//=>{ "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true, "code" : "H12" }
```

### express middleware

```javascript
var logfmt   = require('logfmt').body_parser;

app.use(logfmt());

// req.body is now an array of objects
```

### command line

    echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }
