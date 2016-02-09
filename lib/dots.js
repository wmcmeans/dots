var Dot = Dots.Dot = function (options) {
  this.pos = options.pos;
  this.color = options.color;
  this.game = options.game;
};

Dot.prototype.canConnectWith = function (otherDot) {
  return neighboringDots(this.pos, otherDot.pos) && this.color === otherDot.color;
};

var neighboringDots = function (pos1, pos2) {
  return (pos1[0] <= pos2[0] + 1 && pos1[0] >= pos2[0] - 1) &&
    (pos1[1] <= pos2[1] + 1 && pos1[1] >= pos2[1] - 1);
};

var Board = function () {

};

Board.colors = [
  "purple",
  "green",
  "blue",
  "red",
  "yellow"
];

var randomColor = function () {
  var idx = Math.floor(Math.random() * 6);
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
