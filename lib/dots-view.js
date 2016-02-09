var Board = require('./dots.js');

var View = function ($el) {
  this.$el = $el;

  this.board = new Board();
  this.setupGrid();

  this.render();
  $('.dots-game').on("click", this.handleClickEvent.bind(this));
};

View.prototype.handleClickEvent = function (event) {
  debugger
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
