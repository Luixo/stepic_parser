'use strict';

var controllers = require('./controllers.js');
var fs = require('fs.promised');

var tasks = {
	'get-all-courses-full': function getAllCoursesFull() {
		return controllers.courses.pages().then(function (courses) {
			return fs.writeFile('../out/all-courses-full.json', JSON.stringify(courses));
		});
	},
	'get-enrolled-courses-full': function getEnrolledCoursesFull() {
		return controllers.courses.pages(true).then(function (courses) {
			return fs.writeFile('../out/enrolled-courses-full.json', JSON.stringify(courses));
		});
	},
	'get-enrolled-courses-min': function getEnrolledCoursesMin() {
		return controllers.courses.pages(true).then(function (courses) {
			return courses.map(function (_ref) {
				var title = _ref.title;
				var progress = _ref.progress;
				var sections = _ref.sections;
				return {
					title: title,
					progressId: progress,
					sections: sections
				};
			});
		}).then(function (courses) {
			return fs.writeFile('../out/enrolled-courses-min.json', JSON.stringify(courses));
		});
	},

	'get-section': function getSection() {
		var sections = void 0,
		    courses = void 0;
		var excluded = ['Тестирование первой четверти (11 октября)', 'Экзамен первой четверти (8 ноября)', 'Промежуточное тестирование второй четверти (6 декабря)', 'Промежуточное тестирование третьей четверти (27 марта)', 'Stepic Contest', 'Тренажёр ЕГЭ 2016 / Математика. Базовый уровень', 'Анализ безопасности веб-проектов', 'Дискретные структуры', 'Инвестиционный банкинг изнутри', 'Linear Algebra: Problems and Methods', 'Безопасность в интернете', 'Web технологии'];
		return controllers.courses.pages(true).then(function (result) {
			return courses = result.map(function (_ref2) {
				var title = _ref2.title;
				var progress = _ref2.progress;
				var sections = _ref2.sections;
				return {
					title: title,
					progressId: progress,
					sections: sections
				};
			});
		}).then(function (courses) {
			return controllers.sections.sections(courses.map(function (course) {
				return course.sections;
			}).reduce(function (memo, sections) {
				return memo.concat(sections);
			}, []));
		}).then(function (results) {
			return sections = results.map(function (_ref3) {
				var id = _ref3.id;
				var title = _ref3.title;
				var begin_date = _ref3.begin_date;
				var soft_deadline = _ref3.soft_deadline;
				var hard_deadline = _ref3.hard_deadline;
				var progress = _ref3.progress;
				return {
					id: id,
					title: title,
					start: begin_date,
					end: soft_deadline || hard_deadline,
					progress: progress,
					course: courses.filter(function (course) {
						return course.sections.indexOf(id) !== -1;
					})[0].title,
					no: courses.filter(function (course) {
						return course.sections.indexOf(id) !== -1;
					})[0].sections.indexOf(id) + 1
				};
			});
		}).then(function () {
			return controllers.progresses.progresses(sections.map(function (section) {
				return section.progress;
			}).filter(function (a) {
				return a;
			}));
		}).then(function (results) {
			return ['Курс', '#', 'Открытие', 'Закрытие', 'Статус', 'Название', 'Баллов', 'Всего'].join(';') + '\n' + sections.map(function (section) {
				var _ref4 = results.filter(function (progress) {
					return progress.id === section.progress;
				})[0] || {};

				var _ref4$score = _ref4.score;
				var score = _ref4$score === undefined ? 0 : _ref4$score;
				var _ref4$cost = _ref4.cost;
				var cost = _ref4$cost === undefined ? 0 : _ref4$cost;

				section.score = score;
				section.cost = cost;
				delete section.progress;
				return section;
			}).sort(function (a, b) {
				if (a.course === b.course) return Number(a.no) - Number(b.no);
				return a.course > b.course ? 1 : -1;
			}).sort(function (a, b) {
				if (a.start && b.start) return new Date(a.start) - new Date(b.start);
				if (!a.start && !b.start) {
					if (a.course === b.course) return Number(a.no) - Number(b.no);
					return a.course > b.course ? 1 : -1;
				}
				return a.start ? -1 : 1;
			}).sort(function (a, b) {
				if (a.end && b.end) return new Date(a.end) - new Date(b.end);
				if (!a.end && !b.end) {
					if (a.course === b.course) return Number(a.no) - Number(b.no);
					return a.course > b.course ? 1 : -1;
				}
				return a.end ? -1 : 1;
			}).filter(function (section) {
				return excluded.indexOf(section.course) === -1;
			}).map(function (_ref5) {
				var course = _ref5.course;
				var no = _ref5.no;
				var start = _ref5.start;
				var end = _ref5.end;
				var cost = _ref5.cost;
				var score = _ref5.score;
				var title = _ref5.title;

				if (start) start = new Date(start).toISOString().replace(/T.*$/, '').split('-').reverse().join('.');
				if (end) end = new Date(end).toISOString().replace(/T.*$/, '').split('-').reverse().join('.');
				return [course, no, start || '-', end || '-', Math.floor(5 * score / cost || 0), title, Math.floor(score), Math.floor(cost)].join(';');
			}).join('\n');
		}).then(function (sections) {
			return fs.writeFile('../out/sections.csv', sections);
		});
	},
	'example-table-submission': function exampleTableSubmission() {
		var rows = ['был открыт английским ботаником', 'протекает во всех агрегатных состояниях вещества', 'подтверждает хаотичность теплового движения', 'скорость протекания зависит от температуры', 'обеспечивает схожий газовый состав атмосферы в пределах тропосферы'];
		var columns = ['Диффузия', 'Броуновское движение', 'Нет верного варианта'];
		return controllers.submissions.tryAll('81192', controllers.submissions.tableObject(rows, columns, '010 100 ??0 ??0 ??0'));
	},
	'example-choice-submission': function exampleChoiceSubmission() {
		var rows = ["Между любыми двумя соседними молекулами в жидком и твёрдом состоянии вещества всегда действуют и силы притяжения и силы отталкивания.", "При уменьшении расстояния между молекулами силы притяжения, действующие между ними, возрастают быстрее, чем силы отталкивания.", "Если молекула находится в положении устойчивого равновесия, то силы притяжения, действующие на неё со стороны других молекул, равны по модулю силам отталкивания.", "Молекулы взаимодействуют друг с другом во всех агрегатных состояниях вещества.", "В твёрдом состоянии молекулы взаимодействуют  друг с другом менее интенсивно, чем в жидком."];
		return controllers.submissions.tryAll(83218, controllers.submissions.choiceObject(rows, '101??'), {
			waitMin: 12,
			waitRandom: 4
		});
	}
};
tasks.list = Object.keys(tasks);
module.exports = tasks;