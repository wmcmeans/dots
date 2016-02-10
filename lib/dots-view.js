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
};

View.prototype.handleDotClick = function (event) {
  var pos = [event.target.id[0], event.target.id[2]];
  startDot = this.board.grid[pos[0]][pos[1]];
  this.board.selectedDots = [startDot];
  $(event.target).addClass('active');

  $('li.' + startDot.color).on('mouseenter', function (e) {

    var newPos = [e.target.id[0], e.target.id[2]];
    var newDot = this.board.grid[newPos[0]][newPos[1]];
    var prevDot = this.board.selectedDots[this.board.selectedDots.length - 1];


    if (prevDot.canConnectWith(newDot)) {
      this.board.selectedDots.push(newDot);
      $(e.target).addClass('active');
    }
  }.bind(this));
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
  this.$li.removeClass();

  this.board.grid.forEach(function (column, y) {
    column.forEach(function (dot, x) {
      this.$li.filter("#" + x + "-" + y).addClass(dot.color);
    }.bind(this));
  }.bind(this));
};

View.prototype.updateScore = function () {
  this.$moves.html("Moves Left: " + this.moves);
  this.$score.html("Score: " + this.score);
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
  for (var y = 5; y >= 0; y++) {
    html += "<ul class='row group'>";
    for (var x = 0; x < 6; x++) {
      html += ("<li id='" + x + "-" + y + "'></li>");
    }
    html += "</ul>";
  }

  this.$el.append(html);
  this.$li = this.$el.find("li");
};

module.exports = View;
