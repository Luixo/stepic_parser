module.exports = (token, path, {method, query, body}) =>
	token.request({
		method: method || 'get',
		url: `https://stepic.org/api/${path}`,
		query: query,
		body: body
	}).then(({status, statusText, body}) => {
		console.debug(`Response to ${path} with code: ${status}: ${statusText}`, 3);
		return body;
	}).catch(err => {
		console.debug(`Error while requesting: ${err}`, 1);
	});