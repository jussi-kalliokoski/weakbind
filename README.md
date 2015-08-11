# weakbind

[![Build Status](https://travis-ci.org/jussi-kalliokoski/weakbind.svg?branch=master)](https://travis-ci.org/jussi-kalliokoski/weakbind)

> Memoized bind for higher performance.

## Usage

```
npm install --save weakbind
```

```javascript
var weakbind = require("weakbind");

function fn () {
    return this.x;
}

var context = { x: 1 };
var boundFn = weakbind(x);
boundFn() // 1
```

## What is it?

It's a replacement for the native bind method, but with the distinction that it always returns the same function instead. This is especially useful in React where you pass callbacks down the tree and creating a new instance invalidates your `shouldComponentUpdate` checks.

## How Does it Work?

Internally it uses a two-dimensional `WeakMap` where the first level key is the function and second level key is the context. This means that it doesn't need to leak memory or attach new properties to your functions.

## Pitfalls

* For browsers that don't support `WeakMap`, it provides only a sham, so for example you can't rely on the result being the same if you have to support older JS runtimes. This is a tradeoff between leaking memory and performance, and leaking memory is never acceptable. However, even for older runtimes it's faster than native bind in most cases.
* Can't be used as a drop-in replacement for native bind, as the partial application functionality of native bind is not supported.
* While faster than native bind in most cases, if the functions you're binding are recreated all the time anyway, `weakbind` will actually be slower than native bind.

## Benchmark

The benchmark (`benchmark.js`) was run on my local machine. You can run it yourself to see if the results differ.

### Without `WeakMap` (node.js v.0.10.33)

```
normal bind (trashing): 0.0015860912109973602ms (average) 0.001094ms (median)
normal bind (repeating): 0.0015432097600004845ms (average) 0.001103ms (median)
weakbind (trashing): 0.0004950802689996692ms (average) 0.000339ms (median)
weakbind (repeating): 0.0004421687919996935ms (average) 0.000331ms (median)
```

## With `WeakMap` (iojs v.2.0.2)

```
normal bind (trashing): 0.0012574215769975928ms (average) 0.00117ms (median)
normal bind (repeating): 0.001258740308001994ms (average) 0.001195ms (median)
weakbind (trashing): 0.0055595191419998595ms (average) 0.001625ms (median)
weakbind (repeating): 0.0010129746209979584ms (average) 0.000705ms (median)
```
