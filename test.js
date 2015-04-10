var test = require('tape');
var memoize = require('./');

test('memoizes string args', function (t) {
    var calls = 0;
    function subject(str1, str2, cb) {
        setImmediate(function () {
            calls++;
            cb(null, str1 + '!' + str2);
        });
    }

    var memoized = memoize(subject);

    memoized('hello', 'world', function (err, str) {
        t.equal(str, 'hello!world');
        t.equal(calls, 1);
        memoized('hello', 'world', function (err, str) {
            t.equal(str, 'hello!world');
            t.equal(calls, 1);
            t.end();
        });
    });
});

test('memoizes obj args', function (t) {
    var calls = 0;
    function subject(o1, o2, cb) {
        setImmediate(function () {
            calls++;
            cb(null, o1.prop + '!' + o2.prop);
        });
    }

    var t1 = {
        prop: 'hello'
    };

    var t2 = {
        prop: 'world'
    };

    var memoized = memoize(subject);

    memoized(t1, t2, function (err, str) {
        t.equal(str, 'hello!world');
        t.equal(calls, 1);
        memoized(t1, t2, function (err, str) {
            t.equal(str, 'hello!world');
            t.equal(calls, 1);
            t.end();
        });
    });
});

test('does not memoize errors', function (t) {
    var calls = 0;
    function subject(s1, s2, cb) {
        setImmediate(function () {
            calls++;
            cb(new Error());
        });
    }

    var memoized = memoize(subject);

    memoized('hello', 'world', function (err, str) {
        t.ok(err);
        t.error(str);
        t.equal(calls, 1);
        memoized('hello', 'world', function (err, str) {
            t.ok(err);
            t.error(str);
            t.equal(calls, 2);
            t.end();
        });
    });
});
