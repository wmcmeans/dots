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

Board.prototype.formConnection = function (newSpot) {
  var prevTail = this.selectionTail();
  var exit = prevTail.findNeighbor(newSpot);
  var entry = getOppositeEntry(exit);

  prevTail.occupiedEntries[exit] = true;
  newSpot.occupiedEntries[entry] = true;

  this.selectedDots.push(newSpot);
};

Board.prototype.removeLastConnection = function () {
  var newestConnection = this.newestConnection();
  var entry = newestConnection[1].findNeighbor(newestConnection[0]);
  var exit = getOppositeEntry(entry);

  newestConnection[1].occupiedEntries[entry] = false;
  newestConnection[0].occupiedEntries[exit] = false;

  this.selectedDots.pop();
};

Board.prototype.newestConnection = function () {
  if (this.selectedDots.length < 2) {
    return;
  }
  var lastIdx = this.selectedDots.length - 1;
  return [ this.selectedDots[lastIdx - 1], this.selectedDots[lastIdx] ];
};

Board.prototype.lastEntryPoint = function () {
  var lastConnection = this.newestConnection();
  if (!lastConnection) {
    return;
  }
  return lastConnection[1].findNeighbor(lastConnection[0]);
};

Board.prototype.resetSelections = function () {
  if (this.selectedDots[0]) {
    this.selectedDots[0].isHead = false;
  }
  this.selectedDots.forEach(function (dot) {
    dot.occupiedEntries = {};
  });
  this.selectedDots = [];
};

Board.prototype.selectedColor = function () {
  return this.selectedDots[0].color;
};

Board.prototype.startConnection = function (headDot) {
  this.selectedDots = [headDot];
};

Board.prototype.selectionTail = function () {
  return this.selectedDots[this.selectedDots.length - 1];
};

Board.prototype.anySquares = function () {
  var anySquare = this.selectedDots.find(function (dot) {
    if (dot.isSquared()) {
      return true;
    }
  });
};

Board.prototype.scoreSquares = function () {
  if (this.anySquares()) {
    var selectedColor = this.selectedDots[0].color;

    this.selectedDots = [];
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        if (this.grid[i][j].color === selectedColor) {
          this.selectedDots.push(this.grid[i][j]);
        }
      }
    }
  }
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

function getOppositeEntry(location) {
  switch (location) {
    case "top":
      return "bottom";
    case "right":
      return "left";
    case "bottom":
      return "top";
    case "left":
      return "right";
  }
}

module.exports = Board;
