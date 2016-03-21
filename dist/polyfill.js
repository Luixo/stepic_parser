"use strict";

Promise.reduce = function (promiseFns, start) {
  return promiseFns.reduce(function (memo, fn) {
    return memo.then(function (r) {
      return fn(r);
    });
  }, start instanceof Promise ? start : Promise.resolve(start));
};
Promise.until = function (fn, start) {
  return fn(start).then(function (res) {
    return Promise.resolve(res);
  }, function (res) {
    return Promise.until(fn, res);
  });
};
Promise.timeout = function (ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms);
  });
};
console.debug = function (msg, level) {
  return (console.logLevel || 0) > (level || 2) ? console.log(msg) : null;
};