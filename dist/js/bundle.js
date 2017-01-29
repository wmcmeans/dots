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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.randomColor = exports.queryElAll = exports.queryEl = undefined;
	
	var _constants = __webpack_require__(8);
	
	var queryEl = exports.queryEl = function queryEl(selector) {
	  return document.querySelector(selector);
	};
	var queryElAll = exports.queryElAll = function queryElAll(selector) {
	  return document.querySelectorAll(selector);
	};
	
	var randomColor = exports.randomColor = function randomColor() {
	  var idx = Math.floor(Math.random() * 5);
	  return _constants.colorsArray[idx];
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SpotsGame = function () {
	  function SpotsGame(canvas) {
	    _classCallCheck(this, SpotsGame);
	
	    this.xDim = canvas.offsetWidth;
	    this.yDim = canvas.offsetHeight;
	    this.ctx = canvas.getContext('2d');
	
	    this.trackCursor();
	
	    this.board = new _Board2.default();
	  }
	
	  _createClass(SpotsGame, [{
	    key: 'beginMove',
	    value: function beginMove() {
	      this.board.beginMove(this.cursorPos);
	    }
	  }, {
	    key: 'endMove',
	    value: function endMove() {
	      console.log('ending');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.ctx.clearRect(0, 0, this.xDim, this.yDim);
	
	      this.board.draw(this.ctx, this.cursorPos);
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
	      this.trackMoves();
	    }
	  }, {
	    key: 'trackCursor',
	    value: function trackCursor() {
	      var _this2 = this;
	
	      this.cursorPos = { x: 0, y: 0 };
	      var getCursorPos = function getCursorPos(event) {
	        event.preventDefault();
	        event.stopPropagation();
	
	        var x = event.clientX - _this2.ctx.canvas.offsetLeft;
	        var y = event.clientY - _this2.ctx.canvas.offsetTop;
	        _this2.cursorPos = { x: x, y: y };
	      };
	
	      document.addEventListener('mousemove', getCursorPos);
	    }
	  }, {
	    key: 'trackMoves',
	    value: function trackMoves() {
	      var _this3 = this;
	
	      this.ctx.canvas.addEventListener('mousedown', function () {
	        return _this3.beginMove();
	      });
	      window.addEventListener('mouseup', function () {
	        return _this3.endMove();
	      });
	    }
	  }]);
	
	  return SpotsGame;
	}();
	
	exports.default = SpotsGame;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Spot = __webpack_require__(7);
	
	var _Spot2 = _interopRequireDefault(_Spot);
	
	var _util = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board() {
	    _classCallCheck(this, Board);
	
	    this.selectedSpots = [];
	    this.setup();
	  }
	
	  _createClass(Board, [{
	    key: 'beginMove',
	    value: function beginMove(cursorPos) {
	      var firstSpot = this.findActiveSpot(cursorPos);
	      if (!firstSpot) return false;
	
	      this.selectedSpots.push(firstSpot);
	    }
	  }, {
	    key: 'draw',
	    value: function draw(ctx, cursorPos) {
	      var _this = this;
	
	      this.squareSize = ctx.canvas.offsetWidth / this.grid.length;
	
	      this.grid.forEach(function (row) {
	        return row.forEach(function (spot) {
	          return spot.draw(ctx, _this.squareSize, cursorPos);
	        });
	      });
	    }
	  }, {
	    key: 'findActiveSpot',
	    value: function findActiveSpot(cursorPos) {
	      for (var i = 0; i < this.grid.length; i++) {
	        for (var j = 0; j < this.grid[0].length; j++) {
	          var spot = this.grid[i][j];
	          if (spot.isMouseOver(cursorPos)) return spot;
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      this.grid = [];
	
	      for (var y = 0; y < 6; y++) {
	        var row = [];
	        for (var x = 0; x < 6; x++) {
	          var spot = new _Spot2.default({
	            pos: { x: x, y: y },
	            color: (0, _util.randomColor)()
	          });
	          row.push(spot);
	        }
	        this.grid.push(row);
	      }
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Spot = function () {
	  function Spot(_ref) {
	    var pos = _ref.pos,
	        color = _ref.color;
	
	    _classCallCheck(this, Spot);
	
	    this.pos = pos;
	    this.color = color;
	  }
	
	  _createClass(Spot, [{
	    key: "draw",
	    value: function draw(ctx, sizeOfSpace, cursorPos) {
	      this.setCanvasPos(sizeOfSpace);
	
	      if (this.isMouseOver(cursorPos)) {
	        console.log("mouse over [" + this.pos.x + ", " + this.pos.y + "] (" + this.color + ")");
	      }
	
	      ctx.fillStyle = this.color;
	      ctx.beginPath();
	      ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.canvasPos.radius, 0, Math.PI * 2);
	      ctx.fill();
	    }
	  }, {
	    key: "setCanvasPos",
	    value: function setCanvasPos(sizeOfSpace) {
	      this.canvasPos = {
	        cx: this.pos.x * sizeOfSpace + sizeOfSpace / 2,
	        cy: this.pos.y * sizeOfSpace + sizeOfSpace / 2,
	        radius: sizeOfSpace * 0.22
	      };
	    }
	  }, {
	    key: "isMouseOver",
	    value: function isMouseOver(cursorPos) {
	      var dx = cursorPos.x - this.canvasPos.cx;
	      var dy = cursorPos.y - this.canvasPos.cy;
	      return dx * dx + dy * dy <= this.canvasPos.radius * this.canvasPos.radius;
	    }
	  }]);
	
	  return Spot;
	}();
	
	exports.default = Spot;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var colors = exports.colors = {
	  PURPLE: '#9d5ab7',
	  GREEN: '#89ed90',
	  BLUE: '#8abdff',
	  RED: '#f15c3b',
	  YELLOW: '#e7dd00'
	};
	
	var colorsArray = exports.colorsArray = Object.values(colors);

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map