'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	page(page, enrolled) {
		let obj = { page, enrolled };
		console.debug(`Asked for page ${page}${enrolled ? ' with enrolled courses' : ''}.`);
		if (!obj.enrolled)
			delete obj.enrolled;
		return req(this.token, 'courses', {query: obj});
	}
	pages(enrolled) {
		let result = [];
		console.debug(`Asked for all pages${enrolled ? ' with enrolled courses' : ''}.`);
		return Promise.until(body => {
			if (!body)
				body = {meta: {page: 0, has_next: true}, courses: []};
			result = result.concat(body.courses);
			if (!body.meta || body.meta.has_next)
				return this.page(body.meta.page + 1, enrolled).then(res => Promise.reject(res), reject => Promise.resolve({error: reject}));
			return Promise.resolve(result);
		})
	}
};