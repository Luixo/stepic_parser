'use strict';

module.exports = function (token, path, _ref) {
	var method = _ref.method;
	var query = _ref.query;
	var body = _ref.body;
	return token.request({
		method: method || 'get',
		url: 'https://stepic.org/api/' + path,
		query: query,
		body: body
	}).then(function (_ref2) {
		var status = _ref2.status;
		var statusText = _ref2.statusText;
		var body = _ref2.body;

		console.debug('Response to ' + path + ' with code: ' + status + ': ' + statusText, 3);
		return body;
	}).catch(function (err) {
		console.debug('Error while requesting: ' + err, 1);
	});
};