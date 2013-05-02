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

   curl -X POST --header 'Content-Type: application/logplex-1' -d "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" http://localhost:3000/logs



### command line

    echo "foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf" | logfmt
    { "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }


## caveats

I use a regex instead of a goto-based state machine.  Haters gonna hate. :P
