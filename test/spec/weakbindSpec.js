"use strict";

var weakbind = require("../..");
var sinon = require("sinon");
var chai = require("chai");
chai.should();
chai.use(require("sinon-chai"));

describe("weakbind()", function () {
    var spy;
    var foo;
    var bar;

    beforeEach(function () {
        spy = sinon.spy();
        foo = {};
        bar = {};
    });

    function basicTests () {
        it("should use the provided self as the `this` value", function () {
            weakbind(spy, foo)(1);
            spy.should.have.been.calledOnce;
            spy.should.have.been.calledWithExactly(1);
            spy.should.have.been.calledOn(foo);
        });

        it("should not allow overwriting the bound `this` value", function () {
            var fn = weakbind(spy, foo);
            fn.call(bar);
            fn.bind(bar)();
            spy.should.have.been.calledTwice;
            spy.should.always.have.been.calledOn(foo);
        });

        it("should return the value from the bound function", function () {
            var fn = function (b) { return this.a + b * 2; }
            weakbind(fn, { a: 1 })(2).should.equal(5);
        });
    }

    if ( typeof WeakMap !== "undefined" ) {
        describe("if WeakMap is defined", function () {
            it("should return the same instance every time", function () {
                weakbind(spy, foo).should.equal(weakbind(spy, foo));
            });

            it("should not return the same instance for a different self", function () {
                weakbind(spy, foo).should.not.equal(weakbind(spy, bar));
            });

            it("should not return the same instance for a different function", function () {
                var spy2 = sinon.spy();
                weakbind(spy, foo).should.not.equal(weakbind(spy2, foo));
            });

            basicTests();
        });
    } else {
        describe("if WeakMap is not defined", function () {
            it("should return a different instance every time", function () {
                weakbind(spy, foo).should.not.equal(weakbind(spy, foo));
            });

            basicTests();
        });
    }
});
