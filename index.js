var Map = require('es6-map');

function SometimesFastMap() {
    // Separate strings from others for efficiency
    this.strs = {};
    this.others = new Map();
}

SometimesFastMap.prototype = {
    get: function (k) {
        if (typeof k == 'string') {
            return this.strs[k];
        } else {
            return this.others.get(k);
        }
    },

    set: function (k, v) {
        if (typeof k == 'string') {
            this.strs[k] = v;
        } else {
            this.others.set(k, v);
        }
    }
}

function NestedMap() {
    this.root = new SometimesFastMap();
}

NestedMap.prototype = {
    get: function lookup(keys) {
        var r = this.root;
        var lastkey = keys.length - 1
        for (var i = 0; i < lastkey; i++) {
            r = r.get(keys[i]);
            if (!r) return;
        }

        return r.get(keys[lastkey]);
    },

    set: function (keys, value) {
        var r = this.root;
        var lastkey = keys.length - 1
        var next;
        for (var i = 0; i < lastkey; i++) {
            next = r.get(keys[i]);
            if (!next) r.set(keys[i], next = new NestedMap());
            r = next;
        }

        return r.set(keys[lastkey], value);
    }
}

module.exports = function memoize(fn) {

    var m = new NestedMap();

    return function memoized() {
        var args = Array.prototype.slice.apply(arguments);
        var cb = args.pop();

        var v = m.get(args);

        if (typeof v != 'undefined') {
            cb(null, v);
        } else {
            fn.apply(this, args.concat([function (err, result) {
                if (err) {
                    cb(err);
                } else {
                    m.set(args, result);
                    cb(null, result);
                }
            }]));
        }
    }

};
