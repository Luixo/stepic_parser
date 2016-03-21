'use strict';
const token = require('./auth.js').token;
const fs = require('fs');

if (!token)
	console.debug('No token in auth (controllers.js)!', 0);

let controllers = {};
fs.readdirSync('./controllers/').forEach(controller => controllers[controller.replace(/\..*/, '')] = new (require(`./controllers/${controller}`))(token));
module.exports = controllers;