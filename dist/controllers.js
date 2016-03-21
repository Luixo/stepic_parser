'use strict';

var token = require('./auth.js').token;
var fs = require('fs');

if (!token) console.debug('No token in auth (controllers.js)!', 0);

var controllers = {};
fs.readdirSync('./controllers/').forEach(function (controller) {
	return controllers[controller.replace(/\..*/, '')] = new (require('./controllers/' + controller))(token);
});
module.exports = controllers;