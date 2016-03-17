'use strict';
const token = require('./auth.js').token;
const Courses = require('./controllers/courses.js');
const Sections = require('./controllers/sections.js');
const Progresses = require('./controllers/progresses.js');

if (!token)
	console.debug('No token in auth (controllers.js)!', 0);

module.exports = {
	courses: new Courses(token),
	sections: new Sections(token),
	progresses: new Progresses(token)
};