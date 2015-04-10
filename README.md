simple-memoize
==============

Memoizes a node-style asynchronous function. Does not memoize the errors.

Handles non-string keys.

Use
----

```
var memoize = require('simple-memoize');

var fn = function(arg1, arg2, cb) {
};

var memofunc = memoize(fn);

memofunc('hello', {prop: 'world'}, function (err, val) {
    console.log(err, val);
});
```
