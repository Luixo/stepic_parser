'use strict';
const token = require('./auth.js').token;
const Courses = require('./controllers/courses.js');
const Sections = require('./controllers/sections.js');
const Progresses = require('./controllers/progresses.js');
const Submissions = require('./controllers/submissions.js');

// TODO: require all controllers automatically.

if (!token)
	console.debug('No token in auth (controllers.js)!', 0);

module.exports = {
	courses: new Courses(token),
	sections: new Sections(token),
	progresses: new Progresses(token),
	submissions: new Submissions(token)
};