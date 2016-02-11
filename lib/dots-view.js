var Board = require('./board.js');
var Game = require('./game.js');

var View = function ($el) {
  this.$el = $el;

  this.board = new Board();
  this.game = new Game(this.board);

  this.setupScoreBoard();
  this.setupGrid();
  this.score = 0;
  this.moves = 30;

  this.render();

  $('.dots-game').on("mousedown", this.beginMove.bind(this));
  $('.dots-game').on('mouseup', this.endMove.bind(this));
};

View.prototype.beginMove = function (event) {
  var pos = [event.target.id[0], event.target.id[2]];
  if (typeof pos[0] === "undefined") {
    return;
  }
  var board = this.board;

  var startDot = board.grid[pos[0]][pos[1]];
  startDot.isHead = true;
  board.selectedDots = [startDot];
  $(event.target).addClass('active');
  // addDraggableLineToHMTL();

  var dotEntryPoints = [];
  var occupiedEntries = [];


  $('div.' + startDot.color).hover(function(e) {
    var newPos = [parseInt(e.target.id[0]), parseInt(e.target.id[2])];
    var newDot = board.grid[newPos[0]][newPos[1]];
    var prevDot = board.selectedDots[board.selectedDots.length - 1];

    // if previous dot equals this dot, return
    if (newPos[0] === prevDot.pos[0] && newPos[1] === prevDot.pos[1]) {
      return;
    }


    if (prevDot.canConnectWith(newDot)) {
      formConnection(prevDot, newDot);
      board.selectedDots.push(newDot);

      var entryEdge = closestEdge(e);
      dotEntryPoints.push(entryEdge);

      console.log(entryEdge);
      $(e.target).addClass('active');

      if (newDot.isSquared()) {
        $('div.' + newDot.color).addClass('squared');
      }

    } else {
      var prevInstance = board.selectedDots.find(function(dot) {
        return dot.pos[0] === newDot.pos[0] && dot.pos[1] === newDot.pos[1];
      });
    }


  }, function(e) {
    var exitEdge = closestEdge(e);
    console.log(exitEdge);
    if (exitEdge === dotEntryPoints[dotEntryPoints.length - 1]) {
      removeLastConnection();

      board.selectedDots.pop();
      dotEntryPoints.pop();
      $(e.target).removeClass('active');
    }
  });

  function formConnection(firstDot, secondDot) {
    var exit = firstDot.findNeighbor(secondDot);
    var entry = getOppositeEntry(exit);
    activateHTMLConnection(firstDot, secondDot);

    firstDot.occupiedEntries[exit] = true;
    secondDot.occupiedEntries[entry] = true;

    occupiedEntries.push(exit, entry);
  }

  function removeLastConnection() {
    var lastIdx = board.selectedDots.length - 1;
    var lastEntry = occupiedEntries.pop();
    removeHTMLConnection(board.selectedDots[lastIdx], board.selectedDots[lastIdx - 1]);

    board.selectedDots[lastIdx].occupiedEntries[lastEntry] = null;

    var lastExit = occupiedEntries.pop();
    board.selectedDots[lastIdx - 1].occupiedEntries[lastExit] = null;
  }

    // create div point to draw line to
    // $(document).on('mousemove', function(e){
    //   $('#cursor-pos').css({
    //     left:  e.pageX,
    //     top:   e.pageY
    //   });
    //
    // });



    // get last connected point
    // var lastDot = board.selectedDots[board.selectedDots.length - 1];
    // var lastDotId = "#" + lastDot.pos[1] + "-" + lastDot.pos[1];
    // jsPlumb.connect({
    //   source: $(lastDotId),
    //   target: $('#cursor-pos'),
      // connector: ["Straight"],
      // endpoint: [ "Dot", { radius: 5 }]
    // });
    // // $('div#' + lastDot.pos[0] + "-" + lastDot.pos[1]).
    //
    //
    // jsPlumb.draggable($('#cursor-pos'));
    // debugger
    // $('#cursor-pos').on('move', function (e) {
    //   jsPlumb.repaint();
    // });
  // }

  function activateHTMLConnection(dot1, dot2) {
    var htmlId = getPossibleHTMLIds(dot1, dot2);
    $('li#' + htmlId[0] + "to" + htmlId[1]).addClass('active ' + board.selectedColor());
    $('li#' + htmlId[1] + "to" + htmlId[0]).addClass('active ' + board.selectedColor());
  }

  function removeHTMLConnection(dot1, dot2) {
    var htmlId = getPossibleHTMLIds(dot1, dot2);
    $('li#' + htmlId[0] + "to" + htmlId[1]).removeClass('active ' + board.selectedColor());
    $('li#' + htmlId[1] + "to" + htmlId[0]).removeClass('active ' + board.selectedColor());
  }

  function getPossibleHTMLIds(dot1, dot2) {
    return [
      dot1.pos[0] + "-" + dot1.pos[1],
      dot2.pos[0] + "-" + dot2.pos[1]
    ];
  }

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
  //
  // $('div.' + startDot.color).on('mouseenter', function (e) {
  //
  //   $('#' + e.target.id).on('mouseleave', function (e) {
  //     debugger
  //   });
  //
  //   var newPos = [e.target.id[0], e.target.id[2]];
  //   var newDot = this.board.grid[newPos[0]][newPos[1]];
  //   var prevDot = this.board.selectedDots[this.board.selectedDots.length - 1];
  //   // debugger
  //   if (prevDot.canConnectWith(newDot)) {
  //     this.board.selectedDots.push(newDot);
  //     $(e.target).addClass('active');
  //   } else {
  //     var prevInstance = this.board.selectedDots.find(function(dot) {
  //       return dot.pos[0] === newDot.pos[0] && dot.pos[1] === newDot.pos[1];
  //     });
  //   }
  // }.bind(this));
};

View.prototype.endMove = function (event) {
  $('li').off('mouseenter');
  $('li.connection').attr('class', 'connection');
  this.game.scoreDots();
  this.render();
};

View.prototype.render = function () {
  this.updateScore();
  this.updateClasses();
};

// View.prototype.addJsPlumbEndPoint = function (dot) {
//   LINECOLORS = {
//     purple: "#9d5ab7",
//     green: "#89ed90",
//     blue: "#8abdff",
//     red: "#f15c3b",
//     yellow: "#e7dd00"
//   };
//
//   var dotId = dot.pos[0] + "-" + dot.pos[1];
//   var div = jsPlumb.getElement(dotId);
//   var anchor = jsPlumb.makeSource(div, {
//     endpoint: "Blank",
//     anchor: [ 0.5, 1, 0, 100, 0, 50 ],
//     anchors:[[1, 0.5, 0, 0, 18, 0], "Left"],
//     connector: ["Straight"],
//     connectorStyle: {
//       lineWidth: 12,
//       strokeStyle: LINECOLORS[dot.color]
//     }
//   });
//
// };

View.prototype.updateClasses = function () {
  this.$spot.removeClass();

  this.board.grid.forEach(function (column, x) {
    column.forEach(function (dot, y) {
      var dotX = dot.pos[0];
      var dotY = dot.pos[1];
      this.$spot.filter("#" + dotX + "-" + dotY).addClass(dot.color);
      // this.addJsPlumbEndPoint(dot);
    }.bind(this));
  }.bind(this));
};

View.prototype.updateScore = function () {
  this.$moves.html("Moves Left: " + this.game.moves);
  this.$score.html("Score: " + this.game.score);
};

View.prototype.setupScoreBoard = function () {
  var html =  "<h2 class='scoreboard'>";
      html +=   "<span class='moves-left'></span>";
      html +=   "<span class='score'></span>";
      html += "</h2>";
  this.$el.html(html);
  this.$moves = this.$el.find('.moves-left');
  this.$score = this.$el.find('.score');
};

View.prototype.setupGrid = function () {
  var board = "<figure class='game-board'>";
  var spots = "<section class='spots-board group'>";
  var verticalConnections = "<section class='connections-board vertical'>";
  var horizontalConnections = "<section class='connections-board horizontal'>";
  for (var x = 0; x < 6; x++) {
    spots += "<ul class='column group'>";
    if (x < 5) {
    }
    verticalConnections += "<ul class='vertical connections group'>";
    horizontalConnections += "<ul class='horizontal connections group'>";
    for (var y = 0; y < 6; y++) {
      spots += (
        "<li class='position'><div class='spot' id='" + x + "-" + y + "'></div></li>"
      );
      if (y < 5) {
        verticalConnections += (
          "<li class='connection' id='" + x + "-" + y + "to" + x + "-" + (y + 1) + "'></li>"
        );
        horizontalConnections += (
          "<li class='connection' id='" + y + "-" + x + "to" + (y + 1) + "-" + x + "'></li>"
        );
      }
    }
    spots += "</ul>";
    horizontalConnections += "</ul>";
    verticalConnections += "</ul>";
  }
  spots += "</section>";
  horizontalConnections += "</section>";
  verticalConnections += "</section>";
  board += spots;
  board += horizontalConnections;
  board += verticalConnections;
  board += "</figure>";

  this.$el.append(board);
  // this.$el.append(verticalConnections);
  // this.$el.append(horizontalConnections);
  this.$spot = this.$el.find("div");
  this.$connections = this.$el.find("li.connection");
};

closestEdge = function (event) {
  return closestEdgeFromDimensions(
    event.pageX - $(event.target).offset().left,
    event.pageY - $(event.target).offset().top,
    $(event.target).width(),
    $(event.target).height()
  );
};

closestEdgeFromDimensions = function (x,y,w,h) {
  var topEdgeDist = distMetric(x,y,w/2,0);
  var bottomEdgeDist = distMetric(x,y,w/2,h);
  var leftEdgeDist = distMetric(x,y,0,h/2);
  var rightEdgeDist = distMetric(x,y,w,h/2);
  var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);

  switch (min) {
      case leftEdgeDist:
          return "left";
      case rightEdgeDist:
          return "right";
      case topEdgeDist:
          return "top";
      case bottomEdgeDist:
          return "bottom";
  }
};

var distMetric = function (x,y,x2,y2) {
  var xDiff = x - x2;
  var yDiff = y - y2;
  return (xDiff * xDiff) + (yDiff * yDiff);
};

module.exports = View;
