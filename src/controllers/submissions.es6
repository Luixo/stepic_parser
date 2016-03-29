'use strict';
const req = require('./../request.js');

module.exports = class {
	constructor(token) {
		this.token = token;
	}
	/*
	rows: ['some', 'other']
	columns: ['do a', 'do b']
	source: '0? ?1'
	 */
	tableObject(myRows, myColumns, source) {
		return this.variants(source).map(v => v.split(' ').map(c => c.split(''))).map(alt =>
			({rows, columns}) =>
				({
					choices: rows.map(text => {
						let row = myRows.indexOf(text);
						if (row === -1)
							console.debug(`Unexpected row: ${text}`, 1);
						return {
							name_row: text,
							columns: columns.map(text => {
								let column = myColumns.indexOf(text);
								if (column === -1)
									console.debug(`Unexpected column: ${text}`, 1);
								return {
									name: text,
									answer: alt[row][column] === '1' || alt[row][column] === true
								};
							})
						};
					})
				})
		);
	}
	choiceObject(rows, source) {
		if (source.length !== rows.length)
			throw new Error('Choice object error');
		return this.variants(source).map(v => v.split('')).map(alt =>
			({options}) => ({
				choices: options.map(text => {
					let row = rows.indexOf(text);
					if (row === -1)
						console.debug(`Unexpected options: ${text}`, 1);
					return alt[row] === '1' || alt[row] === true;
				})
			})
		);
	}
	variants(str) {
		if (typeof str === 'string')
			str = [str];
		str = str.map(sub => sub.replace(/!1/g, '10').replace(/!0/g, '01'));
		while (/!\?/.test(str[0]))
			str = str.map(substr => substr.replace('!?', '10')).concat(str.map(substr => substr.replace('!?', '01')));
		while(/\?/.test(str[0]))
			str = str.map(substr => substr.replace('?', '0')).concat(str.map(substr => substr.replace('?', '1')));
		return str;
	}
	tryAll(step, objects, {waitMin, waitRandom = 0} = {waitMin: 12, waitRandom: 4}) {
		console.debug(`Trying ${objects.length} variants${waitMin ? ` with minimum ${waitMin} and additionally ${waitRandom} seconds` : ''}.`, 2);
		return Promise.until((index = 0) => {
			console.debug(`Variant ${index}.`, 2);
			return this.submit(step, objects[index]).then(res => (index < objects.length - 1 && res.status !== 'correct')
				? (waitMin ? Promise.timeout(waitMin*1000 + Math.random()*waitRandom*1000) : Promise.resolve()).then(() => Promise.reject(++index))
				: Promise.resolve(res))
		}).then(res => res.status !== 'correct' ? Promise.reject(`Trying failed with ${objects.length} alternatives tried.`) : Promise.resolve(res))
	}
	submit(step, resolver) {
		let attempt;
		return req(this.token, 'attempts', {
			method: 'post',
			body: { attempt: { step: step.toString() } }
		})
			.then(({attempts:[{id, dataset}]}) =>
				req(this.token, 'submissions', {
					method: 'post',
					body: { submission: { attempt: (attempt = id), reply: resolver(dataset) }}
				})
			)
			// TODO: timeout to evaluating.
			.then(result => Promise.timeout(100))
			.then(() =>
				req(this.token, 'submissions', { query: { attempt } })
			).then(({submissions: [sub]}) => sub)
	}
};