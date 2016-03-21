'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

require('./polyfill.js');
var credentials = require('./../credentials.json');
var auth = require('./auth.js');
var fs = require('fs.promised');

console.logLevel = credentials.logLevel || 0;

auth.setCredentials(credentials).then(function () {
	var tasks = require('./tasks.js');
	console.debug('Starting tasks.', 0);
	return Promise.all(Array.from(new (Function.prototype.bind.apply(Set, [null].concat(_toConsumableArray(process.argv.slice(2).map(function (arg) {
		return tasks.list.filter(function (taskName) {
			return new RegExp(arg).test(taskName);
		});
	})))))()).map(function (taskName) {
		return tasks[taskName]().then(function (res) {
			console.debug('Task ' + taskName + ' completed!', 1);
			return Promise.resolve(res);
		}).catch(function (err) {
			console.debug('Task ' + taskName + ' failed with: ' + err + '.', 0);
			if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object') console.debug('Additionally: ' + err.message + '\n' + err.stack + '.', 0);
		});
	}));
}).then(function () {
	return console.debug('All tasks completed.', 0);
}).catch(function (err) {
	return console.debug('Epic error: ' + ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? err.message + '\n' + err.stack || err : err), 0);
});