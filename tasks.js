'use strict';
const controllers = require('./controllers.js');
let tasks = {
	'get-all-courses-full': () => {
		return controllers.courses.all()
			.then(courses => fs.writeFile('./out/all-courses-full.json', JSON.stringify(courses)))
	},
	'get-enrolled-courses-full': () => {
		return controllers.courses.all(true)
			.then(courses => fs.writeFile('./out/enrolled-courses-full.json', JSON.stringify(courses)))
	},
	'get-enrolled-courses-min': () => {
		return controllers.courses.all(true)
			.then(courses => courses.map(course => {
				return {
					title: course.title,
					progressId: course.progress,
					sections: course.sections
				}
			}))
			.then(courses => fs.writeFile('./out/enrolled-courses-min.json', JSON.stringify(courses)))
	},
	'get-section': () => {
		return controllers.sections.sections([1241, 1242])
			.then(sections => {
				//console.log(JSON.stringify(sections.sections));
				//console.log(sections.sections.length);
				console.log(JSON.stringify(sections));
				console.log(sections.length)
			})
			.catch(err => console.log(`Error: ${err}`));
	},
	'do-test-submission': () => {
		let items = [
			'был открыт английским ботаником',
			'протекает во всех агрегатных состояниях вещества',
			'подтверждает хаотичность теплового движения',
			'скорость протекания зависит от температуры',
			'обеспечивает схожий газовый состав атмосферы в пределах тропосферы'
		];
		let columns = [
			'Диффузия',
			'Броуновское движение',
			'Нет верного варианта'
		];
		let current = controllers.submissions.variants('010 100 ??0 ??0 ??0').map(v => v.split(' ').map(c => c.split('')));
		return controllers.submissions.tryAll('81192', current.map(alt => ({
			choices: items.map((item, rowIndex) => ({
				name_row: item,
				columns: columns.map((column, columnIndex) => ({
					name: column,
					answer: alt[rowIndex][columnIndex] === '1'
				}))
			}))
		}))).then(result => {
			console.log(`Ohh result: ${JSON.stringify(result)}`);
		})
	}
};
tasks.list = Object.keys(tasks);
module.exports = tasks;