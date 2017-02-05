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
	
	var _Game = __webpack_require__(1);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	var _util = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = (0, _util.queryEl)('#spots-game');
	  new _Game2.default(canvas).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Board = __webpack_require__(2);
	
	var _Board2 = _interopRequireDefault(_Board);
	
	var _constants = __webpack_require__(4);
	
	var _util = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SpotsGame = function () {
	  function SpotsGame(canvas) {
	    _classCallCheck(this, SpotsGame);
	
	    this.xDim = canvas.offsetWidth;
	    this.yDim = canvas.offsetHeight;
	    this.ctx = canvas.getContext('2d');
	    (0, _util.fixCanvasBlur)(canvas);
	
	    this.trackCursor();
	
	    this.board = new _Board2.default();
	    this.setupScoreBoard();
	    this.setupGameOverText();
	  }
	
	  _createClass(SpotsGame, [{
	    key: 'addBorderAndBG',
	    value: function addBorderAndBG() {
	      if (this.board.squared) {
	        document.body.style.backgroundColor = (0, _util.getColorAtReducedOpacity)(this.board.moveColor, 0.25);
	        document.body.style.borderColor = (0, _util.getColorAtReducedOpacity)(this.board.moveColor);
	      } else {
	        document.body.style.backgroundColor = '';
	        document.body.style.borderColor = 'transparent';
	      }
	    }
	  }, {
	    key: 'beginMove',
	    value: function beginMove() {
	      this.moving = true;
	      this.board.beginMove(this.cursorPos);
	    }
	  }, {
	    key: 'clearCanvas',
	    value: function clearCanvas() {
	      this.ctx.clearRect(0, 0, this.xDim, this.yDim);
	    }
	  }, {
	    key: 'displayGameOverText',
	    value: function displayGameOverText() {
	      var _this = this;
	
	      this.endGameDom.highScoreTextNodes.forEach(function (span) {
	        return span.textContent = _this.highScore;
	      });
	      this.endGameDom.thisScoreTextNode.textContent = this.score;
	      if (this.newHighScore) {
	        this.endGameDom.gameOverText.classList.add('new-high-score');
	      } else {
	        this.endGameDom.gameOverText.classList.remove('new-high-score');
	      }
	      this.endGameDom.canvasContainer.classList.add('game-over');
	    }
	  }, {
	    key: 'end',
	    value: function end() {
	      this.over = true;
	      this.updateHighScoreIfBeaten();
	      this.displayGameOverText();
	    }
	  }, {
	    key: 'endMove',
	    value: function endMove() {
	      this.moving = false;
	      var points = this.board.endMove();
	      if (points) {
	        this.updateScore(points);
	      }
	      if (this.movesLeft === 0) {
	        this.end();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render(timeDelta) {
	      this.ctx.clearRect(0, 0, this.xDim, this.yDim);
	      this.addBorderAndBG();
	
	      this.board.draw(this.ctx, this.cursorPos, timeDelta);
	    }
	  }, {
	    key: 'setupGameOverText',
	    value: function setupGameOverText() {
	      this.endGameDom = {
	        canvasContainer: (0, _util.queryEl)('#canvas-container'),
	        gameOverText: (0, _util.queryEl)('#game-over-text'),
	        newHighScoreText: (0, _util.queryEl)('#new-high-score'),
	        sameHighScoreText: (0, _util.queryEl)('#same-high-score'),
	        highScoreTextNodes: (0, _util.queryElAll)('.high-score-text'),
	        thisScoreTextNode: (0, _util.queryEl)('#this-score-text')
	      };
	
	      this.endGameDom.canvasContainer.classList.remove('game-over');
	    }
	  }, {
	    key: 'setupScoreBoard',
	    value: function setupScoreBoard() {
	      this.gameTracker = {
	        score: (0, _util.queryEl)('#score'),
	        movesLeft: (0, _util.queryEl)('#moves-left')
	      };
	      this.score = 0;
	      this.movesLeft = 3;
	      // this.movesLeft = 31;
	      this.updateScore();
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this2 = this;
	
	      var animate = function animate(time) {
	        var timeDelta = time - _this2.lastTime;
	        _this2.lastTime = time;
	
	        _this2.render(timeDelta);
	        if (!_this2.over) {
	          window.requestAnimationFrame(animate);
	        } else {
	          _this2.clearCanvas();
	        }
	      };
	      animate(0);
	      this.trackMoves();
	    }
	  }, {
	    key: 'trackCursor',
	    value: function trackCursor() {
	      var _this3 = this;
	
	      this.cursorPos = { x: 0, y: 0 };
	
	      document.addEventListener('mousemove', function (e) {
	        return _this3.cursorPos = (0, _util.getCursorPos)(_this3.ctx.canvas, e);
	      });
	
	      document.addEventListener('touchmove', function (e) {
	        return _this3.cursorPos = (0, _util.getTouchPos)(_this3.ctx.canvas, e);
	      });
	    }
	  }, {
	    key: 'trackMoves',
	    value: function trackMoves() {
	      var _this4 = this;
	
	      this.ctx.canvas.addEventListener('mousedown', function () {
	        return _this4.beginMove();
	      });
	      this.ctx.canvas.addEventListener('touchstart', function (e) {
	        _this4.cursorPos = (0, _util.getTouchPos)(_this4.ctx.canvas, e);
	        _this4.beginMove();
	      });
	
	      window.addEventListener('mouseup', function () {
	        return _this4.endMove();
	      });
	      window.addEventListener('touchend', function () {
	        return _this4.endMove();
	      });
	    }
	  }, {
	    key: 'updateHighScoreIfBeaten',
	    value: function updateHighScoreIfBeaten() {
	      this.highScore = parseInt(localStorage.getItem(_constants.HIGH_SCORE), 10);
	      this.newHighScore = false;
	      if (this.score > this.highScore || Number.isNaN(this.highScore)) {
	        this.newHighScore = true;
	        this.highScore = this.score;
	        localStorage.setItem(_constants.HIGH_SCORE, this.score);
	      }
	    }
	  }, {
	    key: 'updateScore',
	    value: function updateScore() {
	      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	
	      this.score += points;
	      this.movesLeft -= 1;
	      this.gameTracker.score.textContent = this.score;
	      this.gameTracker.movesLeft.textContent = this.movesLeft;
	    }
	  }]);
	
	  return SpotsGame;
	}();
	
	exports.default = SpotsGame;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Spot = __webpack_require__(3);
	
	var _Spot2 = _interopRequireDefault(_Spot);
	
	var _Line = __webpack_require__(6);
	
	var _Line2 = _interopRequireDefault(_Line);
	
	var _util = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board() {
	    _classCallCheck(this, Board);
	
	    this.selectedSpots = [];
	    this.lines = [];
	    this.moveColor = undefined;
	    this.setup();
	  }
	
	  _createClass(Board, [{
	    key: 'addAllSpotsOfColorToMove',
	    value: function addAllSpotsOfColorToMove() {
	      var _this = this;
	
	      var moveColor = this.selectedSpots[0] && this.selectedSpots[0].color;
	      this.grid.forEach(function (row) {
	        row.forEach(function (spot) {
	          if (spot.color === moveColor && !_this.selectedSpots.find(function (selected) {
	            return selected === spot;
	          })) {
	            _this.selectedSpots.push(spot);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'addSpotToMove',
	    value: function addSpotToMove(spot) {
	      spot.setActive();
	      var line = new _Line2.default(spot);
	      if (this.selectedSpots.length) {
	        this.getTailSpot().setInactive();
	        this.getTailLine().forgeConnection(spot);
	      }
	      this.selectedSpots.push(spot);
	      this.lines.push(line);
	    }
	  }, {
	    key: 'beginMove',
	    value: function beginMove(cursorPos) {
	      this.moving = true;
	      var firstSpot = this.findActiveSpot(cursorPos);
	      if (firstSpot) {
	        this.addSpotToMove(firstSpot);
	      } else {
	        this.endMove();
	      }
	    }
	  }, {
	    key: 'cancelMove',
	    value: function cancelMove() {
	      this.selectedSpots.forEach(function (spot) {
	        return spot.setInactive();
	      });
	      this.clearMove();
	    }
	  }, {
	    key: 'checkForNewConnections',
	    value: function checkForNewConnections(cursorPos) {
	      var activeSpot = this.findActiveSpot(cursorPos);
	      var tail = this.getTailSpot();
	      if (activeSpot && activeSpot !== tail && tail.canConnectWith(activeSpot)) {
	        var connectionAreadyExists = this.lines.find(function (_ref) {
	          var startSpot = _ref.startSpot,
	              endSpot = _ref.endSpot;
	          return startSpot === tail && endSpot === activeSpot || startSpot === activeSpot && endSpot === tail;
	        });
	
	        var spotBeforeTail = this.getSpotBeforeTail();
	        if (spotBeforeTail && spotBeforeTail === activeSpot) {
	          this.removeLastConnection();
	          this.checkForSquares();
	        } else if (!connectionAreadyExists) {
	          this.addSpotToMove(activeSpot);
	          this.checkForSquares();
	        }
	      }
	    }
	  }, {
	    key: 'checkForSquares',
	    value: function checkForSquares() {
	      var _this2 = this;
	
	      var seenSpots = new Set();
	      var squared = false;
	      this.lines.forEach(function (_ref2) {
	        var startSpot = _ref2.startSpot;
	
	        var posAsString = startSpot.pos.x + '-' + startSpot.pos.y;
	        if (seenSpots.has(posAsString)) {
	          squared = true;
	        }
	        seenSpots.add(posAsString);
	      });
	
	      this.moveColor = this.selectedSpots[0] && this.selectedSpots[0].color;
	      this.grid.forEach(function (row) {
	        row.forEach(function (spot) {
	          if (spot.color === _this2.moveColor && squared) {
	            spot.setActive();
	          } else if (!_this2.selectedSpots.find(function (selected) {
	            return selected === spot;
	          })) {
	            spot.setInactive();
	          }
	        });
	      });
	
	      this.squared = squared;
	    }
	  }, {
	    key: 'clearMove',
	    value: function clearMove() {
	      this.selectedSpots = [];
	      this.lines = [];
	    }
	  }, {
	    key: 'draw',
	    value: function draw(ctx, cursorPos, timeDelta) {
	      var _this3 = this;
	
	      this.squareSize = ctx.canvas.offsetWidth / this.grid.length;
	
	      if (this.moving) {
	        this.checkForNewConnections(cursorPos);
	      }
	
	      this.grid.forEach(function (row) {
	        return row.forEach(function (spot) {
	          return spot.draw(ctx, _this3.squareSize, cursorPos, timeDelta);
	        });
	      });
	      this.lines.forEach(function (line) {
	        return line.draw(ctx, cursorPos);
	      });
	    }
	  }, {
	    key: 'endMove',
	    value: function endMove() {
	      this.moving = false;
	      if (this.selectedSpots.length > 1) {
	        return this.tallyAndRemoveSpots();
	      }
	      return this.cancelMove();
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
	    key: 'getTailLine',
	    value: function getTailLine() {
	      return this.lines[this.lines.length - 1];
	    }
	  }, {
	    key: 'getTailSpot',
	    value: function getTailSpot() {
	      return this.selectedSpots[this.selectedSpots.length - 1];
	    }
	  }, {
	    key: 'getSpotBeforeTail',
	    value: function getSpotBeforeTail() {
	      if (this.selectedSpots.length < 2) return null;
	      return this.selectedSpots[this.selectedSpots.length - 2];
	    }
	  }, {
	    key: 'removeLastConnection',
	    value: function removeLastConnection() {
	      this.selectedSpots.pop();
	      this.lines.pop();
	      var lastLine = this.lines[this.lines.length - 1];
	      if (lastLine.endSpot) {
	        lastLine.destroyConnection();
	      }
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
	  }, {
	    key: 'tallyAndRemoveSpots',
	    value: function tallyAndRemoveSpots() {
	      var _this4 = this;
	
	      if (this.squared) {
	        this.addAllSpotsOfColorToMove();
	      }
	      this.squared = false;
	
	      var points = this.selectedSpots.length;
	      this.selectedSpots.forEach(function (spot) {
	        var _spot$pos = spot.pos,
	            column = _spot$pos.x,
	            row = _spot$pos.y;
	
	        _this4.grid[row][column] = null;
	        for (var y = row; y > 0; y--) {
	          // this swaps out the positions of the spots so that it shifts them "down" (higher index)
	          _this4.grid[y][column] = _this4.grid[y - 1][column];
	          _this4.grid[y - 1][column] = null;
	          _this4.grid[y][column].pos.y = y;
	
	          if (_this4.grid[y][column]) {
	            _this4.grid[y][column].animateFromPreviousHeight(y - 1);
	          }
	        }
	        var replacementPos = { x: column, y: 0 };
	        var replacementSpot = new _Spot2.default({ pos: replacementPos, color: (0, _util.randomColor)() });
	        _this4.grid[0][column] = replacementSpot;
	        replacementSpot.animateFromPreviousHeight(-1);
	      });
	      this.clearMove();
	      return points;
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constants = __webpack_require__(4);
	
	var _util = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Spot = function () {
	  function Spot(_ref) {
	    var pos = _ref.pos,
	        color = _ref.color;
	
	    _classCallCheck(this, Spot);
	
	    this.pos = pos;
	    this.color = color;
	    this.setInactive();
	  }
	
	  _createClass(Spot, [{
	    key: 'setCanvasPosForAnimationDown',
	    value: function setCanvasPosForAnimationDown(sizeOfSpace, timeDelta) {
	      this.downwardAnimation += timeDelta * 0.004;
	
	      var previousCanvasCY = this.previousY * sizeOfSpace + sizeOfSpace / 2;
	      var currentCanvasCY = this.pos.y * sizeOfSpace + sizeOfSpace / 2;
	      var differenceInCanvasCY = currentCanvasCY - previousCanvasCY;
	
	      if (this.downwardAnimation < 1) {
	        this.canvasPos.cy = previousCanvasCY + differenceInCanvasCY * this.downwardAnimation;
	      } else {
	        this.downwardAnimation = undefined;
	        this.previousY = undefined;
	      }
	    }
	  }, {
	    key: 'canConnectWith',
	    value: function canConnectWith(otherSpot) {
	      var neighbor = this.isNeighboring(otherSpot.pos);
	      var sameColor = this.color === otherSpot.color;
	
	      return neighbor && sameColor;
	    }
	  }, {
	    key: 'draw',
	    value: function draw(ctx, sizeOfSpace, cursorPos, timeDelta) {
	      this.setCanvasPos(sizeOfSpace);
	      if (typeof this.downwardAnimation !== 'undefined') {
	        this.setCanvasPosForAnimationDown(sizeOfSpace, timeDelta);
	      }
	
	      if (this.isHead && !this.isMouseOver(cursorPos)) {
	        this.setInactive();
	      }
	
	      ctx.fillStyle = this.color;
	      ctx.beginPath();
	      ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.canvasPos.radius, 0, Math.PI * 2);
	      ctx.fill();
	
	      if (this.pulsing) {
	        this.increasePulse(timeDelta);
	        this.drawPulse(ctx, timeDelta);
	      }
	    }
	  }, {
	    key: 'drawPulse',
	    value: function drawPulse(ctx) {
	      ctx.fillStyle = (0, _util.getColorAtReducedOpacity)(this.color, this.pulseOpacity);
	      ctx.beginPath();
	      ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.pulseRadius, 0, Math.PI * 2);
	      ctx.fill();
	    }
	  }, {
	    key: 'increasePulse',
	    value: function increasePulse(timeDelta) {
	      this.pulseRadius += 0.08 * timeDelta;
	      this.pulseOpacity -= 0.001 * timeDelta;
	      if (this.pulseOpacity < 0) {
	        this.pulsing = false;
	      }
	    }
	  }, {
	    key: 'isNeighboring',
	    value: function isNeighboring(otherPos) {
	      var _this = this;
	
	      return Object.entries(_constants.DELTAS).find(function (_ref2) {
	        var _ref3 = _slicedToArray(_ref2, 2),
	            delta = _ref3[0],
	            _ref3$ = _ref3[1],
	            x = _ref3$.x,
	            y = _ref3$.y;
	
	        if (_this.pos.x + x === otherPos.x && _this.pos.y + y === otherPos.y) {
	          return delta;
	        }
	        return false;
	      });
	    }
	  }, {
	    key: 'pulse',
	    value: function pulse() {
	      this.pulsing = true;
	      this.pulseRadius = this.canvasPos.radius;
	      this.pulseOpacity = 0.5;
	    }
	  }, {
	    key: 'setActive',
	    value: function setActive() {
	      this.isHead = true;
	      this.radiusPct = 0.25;
	      this.pulse();
	    }
	  }, {
	    key: 'setCanvasPos',
	    value: function setCanvasPos(sizeOfSpace) {
	      this.canvasPos = {
	        cx: this.pos.x * sizeOfSpace + sizeOfSpace / 2,
	        cy: this.pos.y * sizeOfSpace + sizeOfSpace / 2,
	        radius: sizeOfSpace * this.radiusPct
	      };
	    }
	  }, {
	    key: 'setInactive',
	    value: function setInactive() {
	      this.isHead = false;
	      this.radiusPct = 0.22;
	    }
	  }, {
	    key: 'animateFromPreviousHeight',
	    value: function animateFromPreviousHeight(y) {
	      if (typeof this.downwardAnimation === 'undefined') {
	        this.previousY = y;
	        this.downwardAnimation = 0.0001;
	        // handles the case in which multiple new spots are added
	      } else if (this.previousY < 0) {
	        this.previousY -= 1;
	      }
	    }
	  }, {
	    key: 'isMouseOver',
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
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var COLORS = exports.COLORS = {
	  PURPLE: 'rgba(157, 90, 184, 1)',
	  GREEN: 'rgba(138, 237, 145, 1)',
	  BLUE: 'rgba(138, 189, 255, 1)',
	  RED: 'rgba(241, 92, 59, 1)',
	  YELLOW: 'rgba(231, 221, 0, 1)'
	};
	
	var COLORS_ARRAY = exports.COLORS_ARRAY = Object.values(COLORS);
	
	var DELTAS = exports.DELTAS = {
	  top: { x: 0, y: 1 },
	  right: { x: 1, y: 0 },
	  bottom: { x: 0, y: -1 },
	  left: { x: -1, y: 0 }
	};
	
	var HIGH_SCORE = exports.HIGH_SCORE = 'spots-high-score';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getColorAtReducedOpacity = exports.getTouchPos = exports.getCursorPos = exports.fixCanvasBlur = exports.getOppositeDelta = exports.randomColor = exports.queryElAll = exports.queryEl = undefined;
	
	var _constants = __webpack_require__(4);
	
	var queryEl = exports.queryEl = function queryEl(selector) {
	  return document.querySelector(selector);
	};
	var queryElAll = exports.queryElAll = function queryElAll(selector) {
	  return document.querySelectorAll(selector);
	};
	
	var randomColor = exports.randomColor = function randomColor() {
	  var idx = Math.floor(Math.random() * 5);
	  return _constants.COLORS_ARRAY[idx];
	};
	
	var getOppositeDelta = exports.getOppositeDelta = function getOppositeDelta(delta) {
	  switch (delta) {
	    case 'top':
	      return 'bottom';
	    case 'right':
	      return 'left';
	    case 'bottom':
	      return 'top';
	    case 'left':
	      return 'right';
	    default:
	      throw new Error('delta not found in list of deltas');
	  }
	};
	
	var fixCanvasBlur = exports.fixCanvasBlur = function fixCanvasBlur(canvas) {
	  var context = canvas.getContext('2d');
	  var devicePixelRatio = window.devicePixelRatio || 1;
	  var backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
	
	  var ratio = devicePixelRatio / backingStoreRatio;
	
	  if (devicePixelRatio !== backingStoreRatio) {
	    var oldWidth = canvas.width;
	    var oldHeight = canvas.height;
	
	    if (canvas.width > window.innerWidth * 1.1) {
	      var shrinkToFitScreenRatio = window.innerWidth / (canvas.width * 1.1);
	      oldWidth *= shrinkToFitScreenRatio;
	      oldHeight *= shrinkToFitScreenRatio;
	    }
	
	    canvas.width = oldWidth * ratio;
	    canvas.height = oldHeight * ratio;
	
	    canvas.style.width = oldWidth + 'px';
	    canvas.style.height = oldHeight + 'px';
	
	    context.scale(ratio, ratio);
	  }
	};
	
	var getCursorPos = exports.getCursorPos = function getCursorPos(canvas, event) {
	  event.preventDefault();
	  event.stopPropagation();
	
	  var x = event.clientX - canvas.offsetLeft;
	  var y = event.clientY - canvas.offsetTop;
	
	  return { x: x, y: y };
	};
	
	var getTouchPos = exports.getTouchPos = function getTouchPos(canvas, event) {
	  event.preventDefault();
	  event.stopPropagation();
	
	  var touch = event.touches[0] || event.changedTouches[0];
	  var x = touch.clientX - canvas.offsetLeft;
	  var y = touch.clientY - canvas.offsetTop;
	
	  return { x: x, y: y };
	};
	
	var getColorAtReducedOpacity = exports.getColorAtReducedOpacity = function getColorAtReducedOpacity(color) {
	  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
	
	  var opacityIdx = color.length - 2;
	  return '' + color.slice(0, opacityIdx) + opacity + ')';
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Line = function () {
	  function Line(startSpot) {
	    _classCallCheck(this, Line);
	
	    this.startSpot = startSpot;
	  }
	
	  _createClass(Line, [{
	    key: "destroyConnection",
	    value: function destroyConnection() {
	      this.endSpot = undefined;
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx, cursorPos) {
	      ctx.strokeStyle = this.startSpot.color;
	      ctx.lineWidth = 12 * (ctx.canvas.width / 1200);
	      ctx.beginPath();
	      ctx.moveTo(this.startSpot.canvasPos.cx, this.startSpot.canvasPos.cy);
	      if (this.endSpot) {
	        ctx.lineTo(this.endSpot.canvasPos.cx, this.endSpot.canvasPos.cy);
	      } else {
	        ctx.lineTo(cursorPos.x, cursorPos.y);
	      }
	      ctx.stroke();
	    }
	  }, {
	    key: "forgeConnection",
	    value: function forgeConnection(endSpot) {
	      this.endSpot = endSpot;
	    }
	  }]);
	
	  return Line;
	}();
	
	exports.default = Line;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map