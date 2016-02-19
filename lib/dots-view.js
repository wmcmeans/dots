var Board = require('./board.js');
var Game = require('./game.js');

var View = function ($el) {
  this.$el = $el;

  this.renderMenu();
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
  $('div.directions-link').click(this.renderMenu.bind(this));
};

View.prototype.backToGame = function (event) {
  this.setupScoreBoard();
  this.setupGrid();
  this.render();
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

  function activateHTMLConnection() {
    var dots = game.board.newestConnection();

    updateConnectionClass(dots);
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
  this.updateSpots();
  this.renderSpotDrops();
};

View.prototype.setHighScore = function () {
  var highScore = localStorage.getItem('dotsHighScore');
  if (this.game.score > highScore) {
    localStorage.setItem('dotsHighScore', this.game.score);
    this.newHighScore = true;
  }
};

View.prototype.updateSpots = function () {
  var grid = this.board.grid;
  for (var i = 0; i < grid.length; i++) {

    var column = grid[i];
    for (var j = 0; j < 6; j++) {
      var spot = column[j];
      var spotX = spot.pos[0];
      var spotY = spot.pos[1];

    }
  }

  this.board.grid.forEach(function (column, x) {
    column.forEach(function (spot, y) {
      var spotX = spot.pos[0];
      var spotY = spot.pos[1];
      var spotNode = this.$spot.filter("#" + spotX + "-" + spotY);
      if (!spotNode.hasClass(spot.color)) {
        spotNode.before("<li class='position empty-node'></li>");
      }
      spotNode.attr("class", "spot " + spot.color);
    }.bind(this));
  }.bind(this));
};

View.prototype.renderSpotDrops = function () {
  var emptyNodes = $('li.empty-node');
  emptyNodes.animate(
    { height: 0 },
    100,
    "linear",
    function () {
      $(this).remove();
    }
  );
};

View.prototype.getDirectionsHTML = function () {
  var html = "<section class='game-menu'>"+
                "<h3>Directions</h3>" +
                "<p>Connect the dots of the same color to score points.</p>" +
                "<p>Form rectangles to collect all dots of the same color.</p>";
      if (!this.game) {
        html += "<button class='game-button new-game'>New Game</button>";
      } else {
        html += "<button class='game-button back-to-game'>Back to Game</button>";
      }
      html += "</section>";
  return html;
};

View.prototype.getGameOverHTML = function () {
  var html = "<section class='game-menu'>"+
                "<h3>Game Over</h3>";
  if (this.newHighScore) {
    html  += "<p>Congratulations! You scored a new personal high score.</p>" +
             "<p>New high score: " + this.game.score + "</p>";
  } else {
    html  += "<p>You scored " + this.game.score + " points.</p>" +
             "<p>Your high score is " + localStorage.getItem('dotsHighScore') + ".</p>";
  }
    html  += "<button class='new-game'>New Game</button>" +
             "</section>";
  return html;
};

View.prototype.updateScore = function () {
  this.$moves.html("Moves Left: " + this.game.moves);
  this.$score.html("Score: " + this.game.score);
};

View.prototype.renderMenu = function () {
  var html;
  if (this.game && this.game.over()) {
    html = this.getGameOverHTML();
  } else {
    html = this.getDirectionsHTML();
  }
  this.$el.html(html);

  $('button.new-game').click(this.newGame.bind(this));
  $('button.back-to-game').click(this.backToGame.bind(this));
};

View.prototype.setupScoreBoard = function () {
  var html =  "<h2 class='scoreboard group'>";
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
    spots += "<ul id='" + x + "' class='column group'>";
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
  board += "<div class='directions-link'>Directions</div>";

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
