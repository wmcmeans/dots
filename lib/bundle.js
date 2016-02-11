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
	var Game = __webpack_require__(3);
	
	var View = function ($el) {
	  this.$el = $el;
	
	  this.board = new Board();
	  this.game = new Game(this.board);
	
	  this.setupScoreBoard();
	  this.setupGrid();
	  this.score = 0;
	  this.moves = 30;
	
	  this.render();
	
	  $('.dots-game').on("mousedown", this.beginMove.bind(this));
	  $('.dots-game').on('mouseup', this.endMove.bind(this));
	};
	
	View.prototype.beginMove = function (event) {
	  var pos = [event.target.id[0], event.target.id[2]];
	  if (typeof pos[0] === "undefined") {
	    return;
	  }
	  var board = this.board;
	
	  var startDot = board.grid[pos[0]][pos[1]];
	  startDot.isHead = true;
	  board.selectedDots = [startDot];
	  $(event.target).addClass('active');
	  addDraggableLineToHMTL();
	
	  var dotEntryPoints = [];
	  var occupiedEntries = [];
	
	
	  $('div.' + startDot.color).hover(function(e) {
	    var newPos = [parseInt(e.target.id[0]), parseInt(e.target.id[2])];
	    var newDot = board.grid[newPos[0]][newPos[1]];
	    var prevDot = board.selectedDots[board.selectedDots.length - 1];
	
	    // if previous dot equals this dot, return
	    if (newPos[0] === prevDot.pos[0] && newPos[1] === prevDot.pos[1]) {
	      return;
	    }
	
	
	    if (prevDot.canConnectWith(newDot)) {
	      formConnection(prevDot, newDot);
	      board.selectedDots.push(newDot);
	
	      var entryEdge = closestEdge(e);
	      dotEntryPoints.push(entryEdge);
	
	      console.log(entryEdge);
	      $(e.target).addClass('active');
	
	      if (newDot.isSquared()) {
	        $('div.' + newDot.color).addClass('squared');
	      }
	
	    } else {
	      var prevInstance = board.selectedDots.find(function(dot) {
	        return dot.pos[0] === newDot.pos[0] && dot.pos[1] === newDot.pos[1];
	      });
	    }
	
	
	  }, function(e) {
	    var exitEdge = closestEdge(e);
	    console.log(exitEdge);
	    if (exitEdge === dotEntryPoints[dotEntryPoints.length - 1]) {
	      removeLastConnection();
	
	      board.selectedDots.pop();
	      dotEntryPoints.pop();
	      $(e.target).removeClass('active');
	    }
	  });
	
	  function formConnection(firstDot, secondDot) {
	    var exit = firstDot.findNeighbor(secondDot);
	    var entry = getOppositeEntry(exit);
	    activateHTMLConnection(firstDot, secondDot);
	
	    firstDot.occupiedEntries[exit] = true;
	    secondDot.occupiedEntries[entry] = true;
	
	    occupiedEntries.push(exit, entry);
	  }
	
	  function removeLastConnection() {
	    var lastIdx = board.selectedDots.length - 1;
	    var lastEntry = occupiedEntries.pop();
	    removeHTMLConnection(board.selectedDots[lastIdx], board.selectedDots[lastIdx - 1]);
	
	    board.selectedDots[lastIdx].occupiedEntries[lastEntry] = null;
	
	    var lastExit = occupiedEntries.pop();
	    board.selectedDots[lastIdx - 1].occupiedEntries[lastExit] = null;
	  }
	
	  function addDraggableLineToHMTL() {
	    // create div point to draw line to
	    $(document).on('mousemove', function(e){
	      $('#cursor-pos').css({
	        left:  e.pageX,
	        top:   e.pageY
	      });
	    });
	
	    // get last connected point
	    var lastDot = board.selectedDots[board.selectedDots.length - 1];
	    var lastDotId = "#" + lastDot.pos[0] + "-" + lastDot.pos[1];
	    jsPlumb.connect({ source: $('#cursor-pos'), target: $(lastDotId) });
	    // $('div#' + lastDot.pos[0] + "-" + lastDot.pos[1]).
	  }
	
	  function activateHTMLConnection(dot1, dot2) {
	    var htmlId = getPossibleHTMLIds(dot1, dot2);
	    $('li#' + htmlId[0] + "to" + htmlId[1]).addClass('active ' + board.selectedColor());
	    $('li#' + htmlId[1] + "to" + htmlId[0]).addClass('active ' + board.selectedColor());
	  }
	
	  function removeHTMLConnection(dot1, dot2) {
	    var htmlId = getPossibleHTMLIds(dot1, dot2);
	    $('li#' + htmlId[0] + "to" + htmlId[1]).removeClass('active ' + board.selectedColor());
	    $('li#' + htmlId[1] + "to" + htmlId[0]).removeClass('active ' + board.selectedColor());
	  }
	
	  function getPossibleHTMLIds(dot1, dot2) {
	    return [
	      dot1.pos[0] + "-" + dot1.pos[1],
	      dot2.pos[0] + "-" + dot2.pos[1]
	    ];
	  }
	
	  function getOppositeEntry(location) {
	    switch (location) {
	      case "top":
	        return "bottom";
	      case "right":
	        return "left";
	      case "bottom":
	        return "top";
	      case "left":
	        return "right";
	    }
	  }
	  //
	  // $('div.' + startDot.color).on('mouseenter', function (e) {
	  //
	  //   $('#' + e.target.id).on('mouseleave', function (e) {
	  //     debugger
	  //   });
	  //
	  //   var newPos = [e.target.id[0], e.target.id[2]];
	  //   var newDot = this.board.grid[newPos[0]][newPos[1]];
	  //   var prevDot = this.board.selectedDots[this.board.selectedDots.length - 1];
	  //   // debugger
	  //   if (prevDot.canConnectWith(newDot)) {
	  //     this.board.selectedDots.push(newDot);
	  //     $(e.target).addClass('active');
	  //   } else {
	  //     var prevInstance = this.board.selectedDots.find(function(dot) {
	  //       return dot.pos[0] === newDot.pos[0] && dot.pos[1] === newDot.pos[1];
	  //     });
	  //   }
	  // }.bind(this));
	};
	
	View.prototype.endMove = function (event) {
	  $('li').off('mouseenter');
	  $('li.connection').attr('class', 'connection');
	  this.game.scoreDots();
	  this.render();
	};
	
	View.prototype.render = function () {
	  this.updateScore();
	  this.updateClasses();
	};
	
	View.prototype.updateClasses = function () {
	  this.$spot.removeClass();
	
	  this.board.grid.forEach(function (column, x) {
	    column.forEach(function (dot, y) {
	      var dotX = dot.pos[0];
	      var dotY = dot.pos[1];
	      this.$spot.filter("#" + dotX + "-" + dotY).addClass(dot.color);
	    }.bind(this));
	  }.bind(this));
	};
	
	View.prototype.updateScore = function () {
	  this.$moves.html("Moves Left: " + this.game.moves);
	  this.$score.html("Score: " + this.game.score);
	};
	
	View.prototype.setupScoreBoard = function () {
	  var html =  "<h2 class='scoreboard'>";
	      html +=   "<span class='moves-left'></span>";
	      html +=   "<span class='score'></span>";
	      html += "</h2>";
	  this.$el.html(html);
	  this.$moves = this.$el.find('.moves-left');
	  this.$score = this.$el.find('.score');
	};
	
	View.prototype.setupGrid = function () {
	  var board = "<figure class='game-board'>";
	  var spots = "<section class='spots-board group'>";
	  var verticalConnections = "<section class='connections-board vertical'>";
	  var horizontalConnections = "<section class='connections-board horizontal'>";
	  for (var x = 0; x < 6; x++) {
	    spots += "<ul class='column group'>";
	    if (x < 5) {
	    }
	    verticalConnections += "<ul class='vertical connections group'>";
	    horizontalConnections += "<ul class='horizontal connections group'>";
	    for (var y = 0; y < 6; y++) {
	      spots += ("<li class='position'><div class='spot' id='" + x + "-" + y + "'></div></li>");
	      if (y < 5) {
	        verticalConnections += (
	          "<li class='connection' id='" + x + "-" + y + "to" + x + "-" + (y + 1) + "'></li>"
	        );
	        horizontalConnections += (
	          "<li class='connection' id='" + y + "-" + x + "to" + (y + 1) + "-" + x + "'></li>"
	        );
	      }
	    }
	    spots += "</ul>";
	    horizontalConnections += "</ul>";
	    verticalConnections += "</ul>";
	  }
	  spots += "</section>";
	  horizontalConnections += "</section>";
	  verticalConnections += "</section>";
	  board += spots;
	  board += horizontalConnections;
	  board += verticalConnections;
	  board += "</figure>";
	
	  this.$el.append(board);
	  // this.$el.append(verticalConnections);
	  // this.$el.append(horizontalConnections);
	  this.$spot = this.$el.find("div");
	  this.$connections = this.$el.find("li.connection");
	};
	
	closestEdge = function (event) {
	  return closestEdgeFromDimensions(
	    event.pageX - $(event.target).offset().left,
	    event.pageY - $(event.target).offset().top,
	    $(event.target).width(),
	    $(event.target).height()
	  );
	};
	
	closestEdgeFromDimensions = function (x,y,w,h) {
	  var topEdgeDist = distMetric(x,y,w/2,0);
	  var bottomEdgeDist = distMetric(x,y,w/2,h);
	  var leftEdgeDist = distMetric(x,y,0,h/2);
	  var rightEdgeDist = distMetric(x,y,w,h/2);
	  var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);
	
	  switch (min) {
	      case leftEdgeDist:
	          return "left";
	      case rightEdgeDist:
	          return "right";
	      case topEdgeDist:
	          return "top";
	      case bottomEdgeDist:
	          return "bottom";
	  }
	};
	
	var distMetric = function (x,y,x2,y2) {
	  var xDiff = x - x2;
	  var yDiff = y - y2;
	  return (xDiff * xDiff) + (yDiff * yDiff);
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var NEIGHBORS = {
	  top: [0, 1],
	  right: [1, 0],
	  bottom: [0, -1],
	  left: [-1, 0]
	};
	
	var Dot = function (options) {
	  this.pos = options.pos;
	  this.color = options.color;
	  this.occupiedEntries = {};
	  this.isHead = false;
	};
	
	Dot.prototype.canConnectWith = function (otherDot) {
	  var relativeLocation = this.findNeighbor(otherDot);
	  var sameColor = this.color === otherDot.color;
	
	  if (relativeLocation && sameColor) {
	    return !this.occupiedEntries[relativeLocation];
	  }
	};
	
	Dot.prototype.findNeighbor = function (otherDot) {
	  for (var location in NEIGHBORS) {
	    var x = NEIGHBORS[location][0];
	    var y = NEIGHBORS[location][1];
	    if (this.pos[0] + x === otherDot.pos[0] && this.pos[1] + y === otherDot.pos[1]) {
	      return location;
	    }
	  }
	
	  return null;
	};
	
	Dot.prototype.isSquared = function () {
	  var connections = 0;
	  for (var location in this.occupiedEntries) {
	    if (this.occupiedEntries[location]) {
	      connections++;
	    }
	  }
	
	  return (connections > 2 || connections === 2 && this.isHead);
	};
	
	var Board = function () {
	  this.selectedDots = [];
	  this.connections = [];
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
	
	var dotSort = function (dot1, dot2) {
	  if (dot1.pos[0] === dot2.pos[0]) {
	    // sort so that higher dot is removed first/doesn't disrupt other positions
	    if (dot1.pos[1] > dot2.pos[1]) {
	      return -1;
	    } else {
	      return 1;
	    }
	  } else if (dot1.pos[0] > dot2.pos[0]) {
	    return -1;
	  } else {
	    return 1;
	  }
	};
	
	Board.prototype.addConnection = function (newDot) {
	  this.selectedDots.push(newDot);
	};
	
	Board.prototype.selectedColor = function () {
	  return this.selectedDots[0].color;
	};
	
	Board.prototype.startConnection = function (headDot) {
	  this.selectedDots = [headDot];
	};
	
	Board.prototype.scoreSquares = function () {
	  var anySquare = this.selectedDots.find(function (dot) {
	    if (dot.isSquared()) {
	      return true;
	    }
	  });
	
	  if (anySquare) {
	    var selectedColor = this.selectedDots[0].color;
	
	    this.selectedDots = [];
	    for (var i = 0; i < 6; i++) {
	      for (var j = 0; j < 6; j++) {
	        if (this.grid[i][j].color === selectedColor) {
	          this.selectedDots.push(this.grid[i][j]);
	        }
	      }
	    }
	  }
	};
	
	Board.prototype.setup = function () {
	  this.grid = [];
	
	  for (var x = 0; x < 6; x++) {
	    var column = [];
	    for (var y = 0; y < 6; y++) {
	      var dot = new Dot({
	        pos: [x, y],
	        color: randomColor()
	      });
	      column.push(dot);
	    }
	    this.grid.push(column);
	  }
	};
	
	
	Board.prototype.update = function () {
	  var sortedDots = this.selectedDots.sort(dotSort);
	
	  this.selectedDots.forEach(function (dot) {
	    var dotColumn = dot.pos[0];
	    var dotRow = dot.pos[1];
	
	    this.grid[dotColumn].splice(dotRow, 1);
	
	    for (var i = dotRow; i < 5; i++) {
	      this.grid[dotColumn][i].pos[1] = i;
	    }
	
	    this.grid[dotColumn].push(
	      new Dot({
	        pos: [dotColumn, i],
	        color: randomColor()
	      })
	    );
	
	  }.bind(this));
	};
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Game = function (board, moves) {
	  this.board = board;
	  this.moves = moves || 30;
	  this.score = 0;
	
	};
	
	Game.prototype.scoreDots = function () {
	  if (this.board.selectedDots.length > 1) {
	    this.board.scoreSquares();
	    this.score += this.board.selectedDots.length;
	    this.moves -= 1;
	    this.board.update();
	  }
	};
	
	module.exports = Game;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map