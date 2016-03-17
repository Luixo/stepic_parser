'use strict';
const ClientOAuth2 = require('client-oauth2');

module.exports = new class {
	setCredentials(creds) {
		this.oauth = new ClientOAuth2({
			clientId: creds.id,
			clientSecret: creds.secret,
			accessTokenUri: 'https://stepic.org/oauth2/token/',
			authorizationGrants: ['client_credentials'],
			scopes: 'write read'
		});
		return this.oauth.credentials.getToken().then(token => this.token = token);
	}
}();