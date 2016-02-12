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

Game.prototype.clearMove = function () {
  this.board.resetSelections();
};

Game.prototype.beginMove = function (spotPos) {
  var startSpot = this.board.grid[spotPos[0]][spotPos[1]];

  startSpot.isHead = true;
  this.board.selectedDots = [startSpot];
  this.selectedColor = startSpot.color;
};

Game.prototype.addSpotToSelection = function (spotPos) {
  var prevDot = this.board.selectionTail();
  if (spotPos[0] === prevDot.pos[0] && spotPos[1] === prevDot.pos[1]) {
    return false;
  }

  var newDot = this.board.grid[spotPos[0]][spotPos[1]];
  if (prevDot.canConnectWith(newDot)) {
    this.board.formConnection(newDot);
    return true;
  }
};



module.exports = Game;
