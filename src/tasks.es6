'use strict';
const controllers = require('./controllers.js');
const fs = require('fs.promised');

let tasks = {
	'get-all-courses-full': () =>
		controllers.courses.pages()
			.then(courses => fs.writeFile('../out/all-courses-full.json', JSON.stringify(courses))),
	'get-enrolled-courses-full': () =>
		controllers.courses.pages(true)
			.then(courses => fs.writeFile('../out/enrolled-courses-full.json', JSON.stringify(courses))),
	'get-enrolled-courses-min': () =>
		controllers.courses.pages(true)
			.then(courses => courses.map(({title, progress, sections}) => ({
					title: title,
					progressId: progress,
					sections: sections
				})))
			.then(courses => fs.writeFile('../out/enrolled-courses-min.json', JSON.stringify(courses)))
	,
	'get-section': () => {
		let sections, courses;
		let excluded = [
			'Тестирование первой четверти (11 октября)',
			'Экзамен первой четверти (8 ноября)',
			'Промежуточное тестирование второй четверти (6 декабря)',
			'Промежуточное тестирование третьей четверти (27 марта)',

			'Stepic Contest',
			'Тренажёр ЕГЭ 2016 / Математика. Базовый уровень',

			'Анализ безопасности веб-проектов',
			'Дискретные структуры',
			'Инвестиционный банкинг изнутри',
			'Linear Algebra: Problems and Methods',
			'Безопасность в интернете',

			'Web технологии',
		];
		return controllers.courses.pages(true)
			.then(result =>
				courses = result.map(({title, progress, sections}) => ({
					title: title,
					progressId: progress,
					sections: sections
				}))
			)
			.then(courses =>
				controllers.sections.sections(courses
					.map(course => course.sections)
					.reduce((memo, sections) => memo.concat(sections), [])
				)
			)
			.then(results =>
				sections = results.map(({id, title, begin_date, soft_deadline, hard_deadline, progress}) => ({
					id,
					title,
					start: begin_date,
					end: soft_deadline || hard_deadline,
					progress,
					course: courses.filter(course => course.sections.indexOf(id) !== -1)[0].title,
					no: courses.filter(course => course.sections.indexOf(id) !== -1)[0].sections.indexOf(id) + 1
				}))
			)
			.then(() => controllers.progresses.progresses(sections.map(section => section.progress).filter(a => a)))
			.then(results =>
				['Курс', '#', 'Открытие', 'Закрытие', 'Статус', 'Название', 'Баллов', 'Всего'].join(';') + '\n' + sections
					.map(section => {
						let {score = 0, cost = 0} = results.filter(progress => progress.id === section.progress)[0] || {};
						section.score = score;
						section.cost = cost;
						delete section.progress;
						return section
					})
					.sort((a, b) => {
						if (a.course === b.course)
							return Number(a.no) - Number(b.no);
						return a.course > b.course ? 1 : -1;
					})
					.sort((a, b) => {
						if (a.start && b.start)
							return (new Date(a.start) - new Date(b.start));
						if (!a.start && !b.start) {
							if (a.course === b.course)
								return Number(a.no) - Number(b.no);
							return a.course > b.course ? 1 : -1;
						}
						return a.start ? -1 : 1;
					})
					.sort((a, b) => {
						if (a.end && b.end)
							return (new Date(a.end) - new Date(b.end));
						if (!a.end && !b.end) {
							if (a.course === b.course)
								return Number(a.no) - Number(b.no);
							return a.course > b.course ? 1 : -1;
						}
						return a.end ? -1 : 1;
					})
					.filter(section => excluded.indexOf(section.course) === -1)
					.map(({course, no, start, end, cost, score, title}) => {
						if (start)
							start = new Date(start).toISOString().replace(/T.*$/, '').split('-').reverse().join('.');
						if (end)
							end = new Date(end).toISOString().replace(/T.*$/, '').split('-').reverse().join('.');
						return [course, no, start || '-', end || '-', Math.floor(5*score/cost || 0), title, Math.floor(score), Math.floor(cost)].join(';');
					})
					.join(`\n`)
			)
			.then(sections => fs.writeFile('../out/sections.csv', sections))
	},
	'example-table-submission': () => {
		let rows = [
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
		return controllers.submissions.tryAll('81192', controllers.submissions.tableObject(rows, columns, '010 100 ??0 ??0 ??0'));
	},
	'example-choice-submission': () => {
		let rows = [
			"Между любыми двумя соседними молекулами в жидком и твёрдом состоянии вещества всегда действуют и силы притяжения и силы отталкивания.",
			"При уменьшении расстояния между молекулами силы притяжения, действующие между ними, возрастают быстрее, чем силы отталкивания.",
			"Если молекула находится в положении устойчивого равновесия, то силы притяжения, действующие на неё со стороны других молекул, равны по модулю силам отталкивания.",
			"Молекулы взаимодействуют друг с другом во всех агрегатных состояниях вещества.",
			"В твёрдом состоянии молекулы взаимодействуют  друг с другом менее интенсивно, чем в жидком."
		];
		return controllers.submissions.tryAll(83218, controllers.submissions.choiceObject(rows, '101??'), {
			waitMin: 12,
			waitRandom: 4
		})
	},
};
tasks.list = Object.keys(tasks);
module.exports = tasks;