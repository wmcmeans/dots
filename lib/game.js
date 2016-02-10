var Board = require('./board.js');

var Game = function (board, moves) {
  this.board = board;
  this.moves = moves || 30;

};

Game.prototype.scoreDots = function () {
  if (this.board.selectedDots.length > 1) {
    this.score += this.board.selectedDots.length;
    this.moves -= 1;
    this.board.update();
  }
};

module.exports = Game;
