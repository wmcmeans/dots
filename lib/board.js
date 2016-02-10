var NEIGHBORS = {
  top: [0, 1],
  right: [1, 0],
  bottom: [0, -1],
  left: [-1, 0]
};

var Dot = function (options) {
  this.pos = options.pos;
  this.color = options.color;
  this.occupiedEntries = {};
  this.isHead = false;
};

Dot.prototype.canConnectWith = function (otherDot) {
  var relativeLocation = this.findNeighbor(otherDot);
  var sameColor = this.color === otherDot.color;

  if (relativeLocation && sameColor) {
    return !this.occupiedEntries[relativeLocation];
  }
};

Dot.prototype.findNeighbor = function (otherDot) {
  for (var location in NEIGHBORS) {
    var x = NEIGHBORS[location][0];
    var y = NEIGHBORS[location][1];
    if (this.pos[0] + x === otherDot.pos[0] && this.pos[1] + y === otherDot.pos[1]) {
      return location;
    }
  }

  return null;
};

Dot.prototype.isSquared = function () {
  var connections = 0;
  for (var location in this.occupiedEntries) {
    if (this.occupiedEntries[location]) {
      connections++;
    }
  }

  return (connections > 2 || connections === 2 && this.isHead);
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
