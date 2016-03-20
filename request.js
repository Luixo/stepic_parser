module.exports = (token, path, options) =>
	token.request({
		method: (options && options.method) || 'get',
		url: `https://stepic.org/api/${path}`,
		query: options.query,
		body: options.body
	}).then(res => {
		console.debug(`Response to ${path} with code: ${res.status}: ${res.statusText}`, 3);
		return res.body
	}).catch(err => {
		console.debug(`Error while requesting: ${err}`, 1);
	});