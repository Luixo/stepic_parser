module.exports = (token, path, query) =>
	token.request({
		method: 'get',
		url: `https://stepic.org/api/${path}`,
		query
	}).then(res => res.body);