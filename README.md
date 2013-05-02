# node-logfmt

## use

### straight up

```javascript
var logfmt = require('../lib/logfmt'),

logfmt.parse("foo=bar a=14 baz=\"hello kitty\" cool%story=bro f %^asdf")
//=>{ "foo": "bar", "a": 14, "baz": "hello kitty", "cool%story": "bro", "f": true, "%^asdf": true }
```

### express middleware

### command line
