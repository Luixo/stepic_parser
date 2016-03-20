'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	variants(str) {
		if (typeof str === 'string')
			str = [str];
		while(/\?/.test(str[0]))
			str = str.map(substr => substr.replace('?', '0')).concat(str.map(substr => substr.replace('?', '1')));
		return str;
	}
	tryAll(step, objects, options) {
		console.log(`Trying ${objects.length} variants.`);
		return Promise.until(index => {
			if (!index)
				index = 0;
			console.debug(`Variant ${index}.`, 2);
			return this.submit(step, objects[index]).then(res => (index < objects.length - 1 && res.status === 'wrong') ? Promise.reject(++index) : Promise.resolve(res))
		}).then(res => res.status === 'wrong' ? Promise.reject(`Trying failed with ${objects.length} alternatives tried.`) : Promise.resolve(res))
	}
	submit(step, object) {
		console.debug(`[CTRL MTHD] Going to submit ${JSON.stringify(object)}.`, 3);
		let attempt;
		return req(this.token, 'attempts', {
			method: 'post',
			body: { attempt: { step } }
		})
			.then(result =>
				req(this.token, 'submissions', {
					method: 'post',
					body: { submission: { attempt: (attempt = result.attempts[0].id), reply: object }}
				})
			)
			// TODO: timeout to evaluating.
			.then(result => Promise.timeout(100))
			.then(() =>
				req(this.token, 'submissions', {
					query: { attempt }
				})
			).then(res => res.submissions[0])
	}
};