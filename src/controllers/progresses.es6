'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	_progresses(progresses, page = 0) {
		//console.debug(`Inner ask for progresses ${progresses} on page ${page}.`, 2);
		return req(this.token, 'progresses', { query: { 'ids[]': progresses, page }});
	}
	progresses(req) {
		console.debug(`Asked for ${req.length} progresses.`, 2);
		let result = [];
		return Promise.until(({meta: {page = 0, has_next = true} = {}, progresses} = {}) => {
			result = result.concat(progresses);
			if (has_next)
				return this._progresses(req, page + 1).then(res => Promise.reject(res), reject => Promise.resolve({error: reject}));
			return Promise.resolve(result.filter(a => a));
		})
	}
};