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
