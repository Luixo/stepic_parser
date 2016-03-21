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
		key: '_sections',
		value: function _sections(sections) {
			var page = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			//console.debug(`Inner ask for sections ${sections.join(', ')} on page ${page}.`, 2);
			return req(this.token, 'sections', { query: { 'ids[]': sections, page: page } });
		}
	}, {
		key: 'sections',
		value: function sections(req) {
			var _this = this;

			console.debug('Asked for ' + req.length + ' sections.', 2);
			var result = [];
			return Promise.until(function () {
				var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				var _ref$meta = _ref.meta;
				_ref$meta = _ref$meta === undefined ? {} : _ref$meta;
				var _ref$meta$page = _ref$meta.page;
				var page = _ref$meta$page === undefined ? 0 : _ref$meta$page;
				var _ref$meta$has_next = _ref$meta.has_next;
				var has_next = _ref$meta$has_next === undefined ? true : _ref$meta$has_next;
				var sections = _ref.sections;

				result = result.concat(sections);
				if (has_next) return _this._sections(req, page + 1).then(function (res) {
					return Promise.reject(res);
				}, function (reject) {
					return Promise.resolve({ error: reject });
				});
				return Promise.resolve(result.filter(function (a) {
					return a;
				}));
			});
		}
	}]);

	return _class;
}();