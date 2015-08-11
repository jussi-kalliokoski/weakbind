"use strict";

var weakbind = require("./");

var ITERATIONS = 1000000;

var tests = {
    "normal bind": function (context) {
        return context.fn.bind(context.self);
    },

    "weakbind": function (context) {
        return weakbind(context.fn, context.self);
    },
};

function inMilliseconds (hrtime) {
    var seconds = hrtime[0];
    var nanoseconds = hrtime[1];
    return seconds * 1e3 + nanoseconds / 1e6;
}

function measure (fn, name, iterations) {
    var times = [];

    for ( var i = 0; i < iterations; i++ ) {
        var start = process.hrtime();
        fn();
        var time = process.hrtime(start);
        times.push(inMilliseconds(time));
    }

    times.sort(function (a, b) { return a - b; });

    var average = times.reduce(function (a, b) { return a + b; }, 0) / times.length;
    var median = times[Math.floor(times.length / 2)];

    console.log("%s: %sms (average) %sms (median)", name, average, median);
}

Object.keys(tests).forEach(function (name) {
    var test = tests[name];

    measure(function () {
        test({ fn: function () {}, self: {} })();
    }, name + " (trashing)", ITERATIONS);

    var stored = { fn: function () {}, self: {} };

    measure(function () {
        test(stored)();
    }, name + " (repeating)", ITERATIONS);
});
