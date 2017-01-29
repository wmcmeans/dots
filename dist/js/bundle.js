/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Game = __webpack_require__(4);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = (0, _util.queryEl)('#spots-game');
	  new _Game2.default(canvas).start();
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var queryEl = exports.queryEl = function queryEl(selector) {
	  return document.querySelector(selector);
	};
	var queryElAll = exports.queryElAll = function queryElAll(selector) {
	  return document.querySelectorAll(selector);
	};

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Board = __webpack_require__(5);
	
	var _Board2 = _interopRequireDefault(_Board);
	
	var _View = __webpack_require__(6);
	
	var _View2 = _interopRequireDefault(_View);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SpotsGame = function () {
	  function SpotsGame(canvas) {
	    _classCallCheck(this, SpotsGame);
	
	    this.xDim = canvas.offsetWidth;
	    this.yDim = canvas.offsetHeight;
	    this.ctx = canvas.getContext('2d');
	  }
	
	  _createClass(SpotsGame, [{
	    key: 'render',
	    value: function render() {
	      // clear board
	      this.ctx.clearRect(0, 0, this.xDim, this.yDim);
	
	      // change this to render the view using the board (logic)
	      this.ctx.fillStyle = 'gray';
	      this.ctx.fillRect(0, 0, 500, 500);
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this = this;
	
	      var animate = function animate() {
	        _this.render();
	        requestAnimationFrame(animate);
	      };
	      animate();
	    }
	  }]);
	
	  return SpotsGame;
	}();
	
	exports.default = SpotsGame;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function Board() {
	  _classCallCheck(this, Board);
	};
	
	exports.default = Board;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var View = function View() {
	  _classCallCheck(this, View);
	};
	
	exports.default = View;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map