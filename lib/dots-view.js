var Board = require('./dots.js');

var View = function ($el) {
  this.$el = $el;

  this.board = new Board();
};
