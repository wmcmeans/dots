var Board = require('./board.js');
var Game = require('./game.js');

var View = function ($el) {
  this.$el = $el;

  this.board = new Board();
  this.game = new Game(this.board);

  this.setupScoreBoard();
  this.setupGrid();
  this.score = 0;
  this.moves = 30;

  this.render();
  $('.dots-game').on("mousedown", this.handleDotClick.bind(this));
  $('.dots-game').on('mouseup', this.endMove.bind(this));

  // $(function() {
  //     $("div").hover(function(e) {
  //         var edge = closestEdge(e.pageX, e.pageY, $(this).width(), $(this).height());
  //         console.log("in: " + edge);
  //     }, function(e) {
  //         var edge = closestEdge(e.pageX, e.pageY, $(this).width(), $(this).height());
  //         console.log("out: " + edge);
  //     });
  // });
  //
  // $(function() {
  //     $("div.whatever").hover(function(e) {
  //         var edge = closestEdge(
  //           e.pageX - $(this).offset().left,
  //           e.pageY - $(this).offset().top,
  //           $(this).width(),
  //           $(this).height()
  //         );
  //         console.log("in: " + edge);
  //     }, function(e) {
  //       var edge = closestEdge(
  //         e.pageX - $(this).offset().left,
  //         e.pageY - $(this).offset().top,
  //         $(this).width(),
  //         $(this).height()
  //       );
  //       console.log("out: " + edge);
  //     });
  // });

};

View.prototype.handleDotClick = function (event) {
  var pos = [event.target.id[0], event.target.id[2]];
  if (typeof pos[0] === "undefined") {
    return;
  }
  startDot = this.board.grid[pos[0]][pos[1]];
  this.board.selectedDots = [startDot];
  $(event.target).addClass('active');

  dotEntryPoints = [];

  var board = this.board;

  $('div.' + startDot.color).hover(function(e) {
    var newPos = [e.target.id[0], e.target.id[2]];
    var newDot = board.grid[newPos[0]][newPos[1]];
    var prevDot = board.selectedDots[board.selectedDots.length - 1];
    // debugger
    if (prevDot.canConnectWith(newDot)) {
      board.selectedDots.push(newDot);

      var entryEdge = closestEdge(
        e.pageX - $(this).offset().left,
        e.pageY - $(this).offset().top,
        $(this).width(),
        $(this).height()
      );
      dotEntryPoints.push(entryEdge);
      console.log(entryEdge);
      $(e.target).addClass('active');

    } else {
      var prevInstance = board.selectedDots.find(function(dot) {
        return dot.pos[0] === newDot.pos[0] && dot.pos[1] === newDot.pos[1];
      });
    }


  }, function(e) {
    var exitEdge = closestEdge(
      e.pageX - $(this).offset().left,
      e.pageY - $(this).offset().top,
      $(this).width(),
      $(this).height()
    );
    console.log(exitEdge);
    if (exitEdge === dotEntryPoints[dotEntryPoints.length - 1]) {
      board.selectedDots.pop();
      dotEntryPoints.pop();
      $(e.target).removeClass('active');
    }
  });

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
  this.game.scoreDots();
  this.render();
};

View.prototype.render = function () {
  this.updateScore();
  this.updateClasses();
};

View.prototype.updateClasses = function () {
  this.$div.removeClass();

  this.board.grid.forEach(function (column, x) {
    column.forEach(function (dot, y) {
      var dotX = dot.pos[0];
      var dotY = dot.pos[1];
      this.$div.filter("#" + dotX + "-" + dotY).addClass(dot.color);
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
  var html = "";
  for (var x = 0; x < 6; x++) {
    html += "<ul class='row group'>";
    for (var y = 0; y < 6; y++) {
      html += ("<li><div id='" + x + "-" + y + "'></div></li>");
    }
    html += "</ul>";
  }

  this.$el.append(html);
  this.$div = this.$el.find("div");
};

closestEdge = function (x,y,w,h) {
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
