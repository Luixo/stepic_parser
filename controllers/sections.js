'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	section(section) {
		console.debug(`Asked for section ${section}.`, 2);
		return req(this.token, 'sections', {query: `ids[]=${section}`});
	}
	sections(sections) {
		console.debug(`Asked for sections ${sections.join(', ')}.`, 2);
		return req(this.token, 'sections', {query: sections.map(sec => [`ids[]`, sec])}).then(data => data.sections);
	}
};