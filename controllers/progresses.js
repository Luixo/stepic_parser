'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	progress(progress) {
		console.debug(`Asked for progress ${progress}.`);
		return req(this.token, 'progresses', {'ids[]': '79-1241' });
	}
};