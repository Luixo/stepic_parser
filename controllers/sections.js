'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	section(section) {
		console.debug(`Asked for section ${section}.`, 2);
		return req(this.token, 'sections', `ids[]=${section}`);
	}
	/*sections(sections) {
		console.debug(`Asked for sections ${sections.join(', ')}.`, 2);
		return req(this.token, 'sections', sections.map(sec => `ids[]=${sec}`).join('&'));
	}*/
};