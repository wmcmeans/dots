var Board = require('./board.js');
var Game = require('./game.js');

var View = function ($el) {
  this.$el = $el;

  this.renderMenu();

  // this.board = new Board();
  // this.game = new Game(this.board);
  //
  // this.setupScoreBoard();
  // this.setupGrid();
  // this.render();
  //
  // $('.dots-game').on("mousedown touchstart", this.beginMove.bind(this));
  // $(window).on("mouseup touchend", this.endMove.bind(this));
};

View.prototype.newGame = function (event) {
  this.board = new Board();
  this.game = new Game(this.board);

  this.newHighScore = false;

  this.setupScoreBoard();
  this.setupGrid();
  this.render();

  $('.dots-game').on("mousedown touchstart", this.beginMove.bind(this));
  $(window).on("mouseup touchend", this.endMove.bind(this));
};

View.prototype.beginMove = function (event) {
  event.preventDefault();
  if (event.target.classList[0] !== "spot") {
    return;
  }

  var dotPos = [event.target.id[0], event.target.id[2]];
  var board = this.board;
  var game = this.game;

  game.beginMove(dotPos);
  $(event.target).addClass('active');

  $('div.' + this.game.selectedColor).on("mouseenter touchenter", function(e) {
    var newPos = [parseInt(e.target.id[0]), parseInt(e.target.id[2])];

    if (game.addSpotToSelection(newPos)) {
      activateHTMLConnection();
      $(e.target).addClass('active');

      if (board.selectionTail().isSquared()) {
        $('div.' + board.selectedColor()).addClass('squared');
      }
    }

  });

  $('div.' + this.game.selectedColor).on("mouseleave touchleave", function(e) {
    var exitEdge = closestEdge(e);

    if (exitEdge === board.lastEntryPoint()) {
      game.revertSelection();
      updateHTMLConnections();

      $(e.target).removeClass('active');
      if (!board.anySquares()) {
        $('div.' + board.selectedColor()).removeClass('squared');
      }
    }
  });

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

  function activateHTMLConnection() {
    var dots = game.board.newestConnection();

    updateConnectionClass(dots);
    // jsPlumb.connect({
    //   source: dot1.pos[0] + "-" + dot1.pos[1],
    //   target: dot2.pos[0] + "-" + dot2.pos[1],
    //   connector: ["Straight"],
    //   anchor: "Center",
    //   endpoint: [ "Dot", { radius: 5 }]
    // });
  }

  function updateConnectionClass(dots) {
    var htmlId = getPossibleHTMLIds(dots);

    $('li#' + htmlId[0] + "to" + htmlId[1]).addClass('active ' + board.selectedColor());
    $('li#' + htmlId[1] + "to" + htmlId[0]).addClass('active ' + board.selectedColor());
  }

  function updateHTMLConnections() {
    $('li').removeClass('active ' + board.selectedColor());

    for (var i = 0; i < board.selectedDots.length - 1; i++) {
      var dots = [board.selectedDots[i], board.selectedDots[i + 1]];
      updateConnectionClass(dots);
    }
  }

  function getPossibleHTMLIds(dots) {
    var dot1 = dots[0];
    var dot2 = dots[1];
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
};

View.prototype.endMove = function (event) {
  $('div.spot').unbind();
  $('li.connection').attr('class', 'connection');
  this.game.scoreDots();
  this.render();
  if (this.game.over()) {
    this.setHighScore();
    $(".dots-game").unbind();
    $(window).unbind("mouseup");
    this.renderMenu();
  }
};

View.prototype.render = function () {
  this.updateScore();
  this.updateClasses();
};

View.prototype.setHighScore = function () {
  var highScore = localStorage.getItem('dotsHighScore');
  if (this.game.score > highScore) {
    localStorage.setItem('dotsHighScore', this.game.score);
    this.newHighScore = true;
  }
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
  this.$spot.attr("class", "spot");

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

View.prototype.renderMenu = function () {
  var h3text;
  var p1text;
  var p2text;
  if (this.game && this.game.over()) {
    h3text = "Game Over";
    if (this.newHighScore) {
      p1text = "Congratulations! You scored a new personal high score.";
      p2text = "New high score: " + this.game.score;
    } else {
      p1text = "You scored " + this.game.score + " points.";
      p2text = "Your high score is " + localStorage.getItem('dotsHighScore') + ".";
    }
  } else {
    h3text = "Directions";
    p1text = "Connect the dots of the same color to score points.";
    p2text = "Form rectangles to collect all dots of the same color.";
  }

  var html = "<section class='game-menu'>";
      html +=   "<h3>" + h3text + "</h3>";
      html +=   "<p>" + p1text + "</p>";
      html +=   "<p>" + p2text + "</p>";
      html +=   "<button class='new-game'>New Game</button>";
      html += "</section>";
  this.$el.html(html);
  $('button.new-game').click(this.newGame.bind(this));
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
  this.$spot = this.$el.find("div.spot");
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
