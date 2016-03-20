Promise.reduce = (promiseFns, start) => promiseFns.reduce((memo, fn) => memo.then(r => fn(r)), start instanceof Promise ? start : Promise.resolve(start));
Promise.until = (fn, start) => fn(start).then(res => Promise.resolve(res), res => Promise.until(fn, res));
Promise.timeout = ms => new Promise(res => setTimeout(res, ms));
console.debug = (msg, level) => (console.logLevel || 0) > (level || 2) ? console.log(msg) : null;