'use strict';
const ClientOAuth2 = require('client-oauth2');
const credentials = require('./credentials.json');

const stepicAuth = new ClientOAuth2({
	clientId: credentials.id,
	clientSecret: credentials.secret,
	accessTokenUri: 'https://stepic.org/oauth2',
	authorizationGrants: ['credentials']
});

stepicAuth.credentials.getToken().then(data => {
	getCoursePage(1).then(res => console.log(res.courses[0].id + '(1)')).catch(rej => console.warn(rej));
}).catch(err => console.warn(err));

const getCoursePage = index =>
	stepicAuth.request({
		method: 'get',
		url: 'https://stepic.org/api/courses',
		query: {
			page: index
			//enrolled: true
		}
	}).then(res => res.body);