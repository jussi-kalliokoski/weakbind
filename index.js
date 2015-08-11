"use strict";

var bind = function weakbind (fn, self) {
    return function bound () {
        return fn.apply(self, arguments);
    };
};

if ( typeof WeakMap === "undefined" ) {
    module.exports = bind;
} else {
    var functions = new WeakMap();

    module.exports = function weakbind (fn, self) {
        if ( functions.has(fn) ) {
            var selves = functions.get(fn);

            if ( selves.has(self) ) {
                return selves.get(self);
            } else {
                var bound = bind(fn, self);
                selves.set(self, bound);
                return bound;
            }
        } else {
            var selves = new WeakMap();
            functions.set(fn, selves);

            var bound = bind(fn, self);
            selves.set(self, bound);
            return bound;
        }
    };
}
