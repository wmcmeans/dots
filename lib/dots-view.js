var Board = require('./dots.js');

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
