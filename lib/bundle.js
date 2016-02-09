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
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var DotsView = __webpack_require__(1);
	
	$(function () {
	  var rootEl = $('.dots-game');
	  new DotsView(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	var View = function ($el) {
	  this.$el = $el;
	
	  this.board = new Board();
	  this.setupGrid();
	  this.score = 0;
	
	  this.render();
	  $('.dots-game').on("mousedown", this.handleDotClick.bind(this));
	  $('.dots-game').on('mouseup', this.scoreDots.bind(this));
	};
	
	View.prototype.handleDotClick = function (event) {
	  var pos = [event.target.id[0], event.target.id[2]];
	  startDot = this.board.grid[pos[0]][pos[1]];
	  this.selectedDots = [startDot];
	  $(event.target).addClass('active');
	
	  $('li.' + startDot.color).on('mouseenter', function (e) {
	
	    var newPos = [e.target.id[0], e.target.id[2]];
	    var newDot = this.board.grid[newPos[0]][newPos[1]];
	    var prevDot = this.selectedDots[this.selectedDots.length - 1];
	
	
	    if (prevDot.canConnectWith(newDot)) {
	      this.selectedDots.push(newDot);
	      $(e.target).addClass('active');
	    }
	  }.bind(this));
	};
	
	View.prototype.scoreDots = function (event) {
	  $('li').off('mouseenter');
	  this.score += this.selectedDots.length;
	  console.log(this.score);
	  this.render();
	};
	
	View.prototype.render = function () {
	  this.updateClasses(this.board.grid);
	};
	
	View.prototype.updateClasses = function () {
	  this.$li.removeClass();
	
	  this.board.grid.forEach(function (row, i) {
	    row.forEach(function (dot, j) {
	      this.$li.filter("#" + i + "-" + j).addClass(dot.color);
	    }.bind(this));
	  }.bind(this));
	};
	
	View.prototype.setupGrid = function () {
	  var html = "";
	  for (var i = 0; i < 6; i++) {
	    html += "<ul class='row group'>";
	    for (var j = 0; j < 6; j++) {
	      html += ("<li id='" + i + "-" + j + "'></li>");
	    }
	    html += "</ul>";
	  }
	
	  this.$el.html(html);
	  this.$li = this.$el.find("li");
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var DELTAS = [
	  [0, 1],
	  [0, -1],
	  [1, 0],
	  [-1, 0]
	];
	
	var Dot = function (options) {
	  this.pos = options.pos;
	  this.color = options.color;
	};
	
	Dot.prototype.canConnectWith = function (otherDot) {
	  return neighboringDots(this.pos, otherDot.pos) && this.color === otherDot.color;
	};
	
	var neighboringDots = function (pos1, pos2) {
	  for (var i = 0; i < DELTAS.length; i++) {
	    var x = DELTAS[i][0];
	    var y = DELTAS[i][1];
	    if (pos1[0] + x === pos2[0] && pos1[1] + y === pos2[1]) {
	      return true;
	    }
	  }
	
	  return false;
	};
	
	var Board = function () {
	   this.setup();
	};
	
	Board.colors = [
	  "purple",
	  "green",
	  "blue",
	  "red",
	  "yellow"
	];
	
	var randomColor = function () {
	  var idx = Math.floor(Math.random() * 5);
	  return Board.colors[idx];
	};
	
	Board.prototype.setup = function () {
	  this.grid = [];
	
	  for (var i = 0; i < 6; i++) {
	    var row = [];
	    for (var j = 0; j < 6; j++) {
	      var dot = new Dot ({
	        pos: [i, j],
	        color: randomColor()
	      });
	      row.push(dot);
	    }
	    this.grid.push(row);
	  }
	};
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map