'use strict';
require('./polyfill.js');
const credentials = require('./../credentials.json');
const auth = require('./auth.js');
const fs = require('fs.promised');

console.logLevel = credentials.logLevel || 0;

auth.setCredentials(credentials)
	.then(() => {
		const tasks = require('./tasks.js');
		console.debug('Starting tasks.', 0);
		return Promise.all(Array.from(new Set(...process.argv.slice(2).map(arg => tasks.list.filter(taskName => new RegExp(arg).test(taskName))))).map(taskName =>
			tasks[taskName]().then(res => {
				console.debug(`Task ${taskName} completed!`, 1);
				return Promise.resolve(res);
			}).catch(err => {
				console.debug(`Task ${taskName} failed with: ${err}.`, 0);
				if (typeof err === 'object')
					console.debug(`Additionally: ${err.message}\n${err.stack}.`, 0);
			})
		))
	})
	.then(() => console.debug('All tasks completed.', 0))
	.catch(err => console.debug(`Epic error: ${typeof err === 'object' ? `${err.message}\n${err.stack}` || err : err}`, 0));