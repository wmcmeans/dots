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

Board.prototype.checkForSquares = function () {

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
