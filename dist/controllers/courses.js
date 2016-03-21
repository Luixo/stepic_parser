'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var req = require('./../request.js');

module.exports = function () {
	function _class(token) {
		_classCallCheck(this, _class);

		this.token = token;
	}

	_createClass(_class, [{
		key: 'page',
		value: function page(_page, enrolled) {
			var obj = { page: _page, enrolled: enrolled };
			console.debug('Asked for page ' + _page + (enrolled ? ' with enrolled courses' : '') + '.');
			if (!obj.enrolled) delete obj.enrolled;
			return req(this.token, 'courses', { query: obj });
		}
	}, {
		key: 'pages',
		value: function pages(enrolled) {
			var _this = this;

			var result = [];
			console.debug('Asked for all pages' + (enrolled ? ' with enrolled courses' : '') + '.');
			return Promise.until(function (body) {
				if (!body) body = { meta: { page: 0, has_next: true }, courses: [] };
				result = result.concat(body.courses);
				if (!body.meta || body.meta.has_next) return _this.page(body.meta.page + 1, enrolled).then(function (res) {
					return Promise.reject(res);
				}, function (reject) {
					return Promise.resolve({ error: reject });
				});
				return Promise.resolve(result);
			});
		}
	}]);

	return _class;
}();