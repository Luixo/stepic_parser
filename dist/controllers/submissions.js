'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var req = require('./../request.js');

module.exports = function () {
	function _class(token) {
		_classCallCheck(this, _class);

		this.token = token;
	}
	/*
 rows: ['some', 'other']
 columns: ['do a', 'do b']
 source: '0? ?1'
  */


	_createClass(_class, [{
		key: 'tableObject',
		value: function tableObject(myRows, myColumns, source) {
			return this.variants(source).map(function (v) {
				return v.split(' ').map(function (c) {
					return c.split('');
				});
			}).map(function (alt) {
				return function (_ref) {
					var rows = _ref.rows;
					var columns = _ref.columns;
					return {
						choices: rows.map(function (text) {
							var row = myRows.indexOf(text);
							if (row === -1) console.debug('Unexpected row: ' + text, 1);
							return {
								name_row: text,
								columns: columns.map(function (text) {
									var column = myColumns.indexOf(text);
									if (column === -1) console.debug('Unexpected column: ' + text, 1);
									return {
										name: text,
										answer: alt[row][column] === '1' || alt[row][column] === true
									};
								})
							};
						})
					};
				};
			});
		}
	}, {
		key: 'choiceObject',
		value: function choiceObject(rows, source) {
			if (source.length !== rows.length) throw new Error('Choice object error');
			return this.variants(source).map(function (v) {
				return v.split('');
			}).map(function (alt) {
				return function (_ref2) {
					var options = _ref2.options;
					return {
						choices: options.map(function (text) {
							var row = rows.indexOf(text);
							if (row === -1) console.debug('Unexpected options: ' + text, 1);
							return alt[row] === '1' || alt[row] === true;
						})
					};
				};
			});
		}
	}, {
		key: 'variants',
		value: function variants(str) {
			if (typeof str === 'string') str = [str];
			while (/\?/.test(str[0])) {
				str = str.map(function (substr) {
					return substr.replace('?', '0');
				}).concat(str.map(function (substr) {
					return substr.replace('?', '1');
				}));
			}return str;
		}
	}, {
		key: 'tryAll',
		value: function tryAll(step, objects) {
			var _this = this;

			var _ref3 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var waitMin = _ref3.waitMin;
			var _ref3$waitRandom = _ref3.waitRandom;
			var waitRandom = _ref3$waitRandom === undefined ? 0 : _ref3$waitRandom;

			console.debug('Trying ' + objects.length + ' variants' + (waitMin ? ' with minimum ' + waitMin + ' and additionally ' + waitRandom + ' seconds' : '') + '.', 2);
			return Promise.until(function () {
				var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

				console.debug('Variant ' + index + '.', 2);
				return _this.submit(step, objects[index]).then(function (res) {
					return index < objects.length - 1 && res.status === 'wrong' ? (waitMin ? Promise.timeout(waitMin * 1000 + Math.random() * waitRandom * 1000) : Promise.resolve()).then(function () {
						return Promise.reject(++index);
					}) : Promise.resolve(res);
				});
			}).then(function (res) {
				return res.status === 'wrong' ? Promise.reject('Trying failed with ' + objects.length + ' alternatives tried.') : Promise.resolve(res);
			});
		}
	}, {
		key: 'submit',
		value: function submit(step, resolver) {
			var _this2 = this;

			var attempt = void 0;
			return req(this.token, 'attempts', {
				method: 'post',
				body: { attempt: { step: step.toString() } }
			}).then(function (_ref4) {
				var _ref4$attempts = _slicedToArray(_ref4.attempts, 1);

				var _ref4$attempts$ = _ref4$attempts[0];
				var id = _ref4$attempts$.id;
				var dataset = _ref4$attempts$.dataset;
				return req(_this2.token, 'submissions', {
					method: 'post',
					body: { submission: { attempt: attempt = id, reply: resolver(dataset) } }
				});
			})
			// TODO: timeout to evaluating.
			.then(function (result) {
				return Promise.timeout(100);
			}).then(function () {
				return req(_this2.token, 'submissions', { query: { attempt: attempt } });
			}).then(function (_ref5) {
				var _ref5$submissions = _slicedToArray(_ref5.submissions, 1);

				var sub = _ref5$submissions[0];
				return sub;
			});
		}
	}]);

	return _class;
}();