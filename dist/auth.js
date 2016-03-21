'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientOAuth2 = require('client-oauth2');

module.exports = new (function () {
	function _class() {
		_classCallCheck(this, _class);
	}

	_createClass(_class, [{
		key: 'setCredentials',
		value: function setCredentials(_ref) {
			var _this = this;

			var id = _ref.id;
			var secret = _ref.secret;

			this.oauth = new ClientOAuth2({
				clientId: id,
				clientSecret: secret,
				accessTokenUri: 'https://stepic.org/oauth2/token/',
				authorizationGrants: ['client_credentials'],
				scopes: 'write read'
			});
			return this.oauth.credentials.getToken().then(function (token) {
				return _this.token = token;
			});
		}
	}]);

	return _class;
}())();