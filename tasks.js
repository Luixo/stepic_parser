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
	'get-test-section': () => {
		return controllers.sections.section('1241')
			.then(section => console.log(JSON.stringify(section)))
			.catch(err => console.log(`Error: ${err}`));
	}
};
tasks.list = Object.keys(tasks);
module.exports = tasks;