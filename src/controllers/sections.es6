'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	_sections(sections, page = 0) {
		//console.debug(`Inner ask for sections ${sections.join(', ')} on page ${page}.`, 2);
		return req(this.token, 'sections', { query: { 'ids[]': sections, page }});
	}
	sections(req) {
		console.debug(`Asked for ${req.length} sections.`, 2);
		let result = [];
		return Promise.until(({meta: {page = 0, has_next = true} = {}, sections} = {}) => {
			result = result.concat(sections);
			if (has_next)
				return this._sections(req, page + 1).then(res => Promise.reject(res), reject => Promise.resolve({error: reject}));
			return Promise.resolve(result.filter(a => a));
		})
	}
};