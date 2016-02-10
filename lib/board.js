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
  this.selectedDots = [];
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

  for (var y = 0; y < 6; y++) {
    var column = [];
    for (var x = 0; x < 6; x++) {
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
  var colsToUpdate = {};
  this.selectedDots.forEach(function (dot) {
    var dotColumn = dot.pos[1];
    this.grid[dotColumn].splice(dot.pos[0], 1);
    colsToUpdate[dotColumn] = (colsToUpdate[dotColumn] || 0) + 1;
  });
};

module.exports = Board;
