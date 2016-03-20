'use strict';
require('./polyfill.js');
const credentials = require('./credentials.json');
const auth = require('./auth.js');
const fs = require('fs.promised');

console.logLevel = credentials.logLevel || 0;

auth.setCredentials(credentials)
	.then(() => {
		const tasks = require('./tasks.js');
		console.debug('Starting tasks.', 0);
		return Promise.all(tasks.list.filter(taskName => /test/.test(taskName)).map(taskName =>
			tasks[taskName]().then(res => {
				console.debug(`Task ${taskName} completed!`, 1);
				return Promise.resolve(res);
			}).catch(err => {
				console.debug(`Task ${taskName} failed with: ${err}.`, 0);
			})
		))
	})
	.then(() => console.debug('All tasks completed.', 0))
	.catch(err => console.debug(`Epic error: ${typeof err === 'object' ? err.message || err : err}`, 0));