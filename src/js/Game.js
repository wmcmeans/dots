import Board from './Board';
import { HIGH_SCORE } from './constants';
import {
  fixCanvasBlur,
  getCursorPos,
  getTouchPos,
  getColorAtReducedOpacity,
  queryEl,
  queryElAll,
} from './util';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
    fixCanvasBlur(canvas);

    this.trackCursor();

    this.board = new Board();
    this.setupScoreBoard();
    this.setupGameOverText();
  }
  addBorderAndBG() {
    if (this.board.squared) {
      document.body.style.backgroundColor = getColorAtReducedOpacity(this.board.moveColor, 0.25);
      document.body.style.borderColor = getColorAtReducedOpacity(this.board.moveColor);
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.borderColor = 'transparent';
    }
  }
  beginMove() {
    this.moving = true;
    this.board.beginMove(this.cursorPos);
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);
  }
  displayGameOverText() {
    this.endGameDom.highScoreTextNodes.forEach(span => span.textContent = this.highScore);
    this.endGameDom.thisScoreTextNode.textContent = this.score;
    if (this.newHighScore) {
      this.endGameDom.gameOverText.classList.add('new-high-score');
    } else {
      this.endGameDom.gameOverText.classList.remove('new-high-score');
    }
    this.endGameDom.canvasContainer.classList.add('game-over');
  }
  end() {
    this.over = true;
    this.updateHighScoreIfBeaten();
    this.displayGameOverText();
  }
  endMove() {
    this.moving = false;
    const points = this.board.endMove();
    if (points) {
      this.updateScore(points);
    }
    if (this.movesLeft === 0) {
      this.end();
    }
  }
  render(timeDelta) {
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);
    this.addBorderAndBG();

    this.board.draw(this.ctx, this.cursorPos, timeDelta);
  }
  reset() {
    this.endGameDom.canvasContainer.classList.remove('game-over');
    this.over = false;
    this.score = 0;
    this.board = new Board();
    this.setupScoreBoard();
    this.start();
  }
  setupGameOverText() {
    queryEl('#new-game-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.reset();
    });

    this.endGameDom = {
      canvasContainer: queryEl('#canvas-container'),
      gameOverText: queryEl('#game-over-text'),
      newHighScoreText: queryEl('#new-high-score'),
      sameHighScoreText: queryEl('#same-high-score'),
      highScoreTextNodes: queryElAll('.high-score-text'),
      thisScoreTextNode: queryEl('#this-score-text'),
    };
  }
  setupScoreBoard() {
    this.gameTracker = {
      score: queryEl('#score'),
      movesLeft: queryEl('#moves-left'),
    };
    this.score = 0;
    this.movesLeft = 3;
    // this.movesLeft = 31;
    this.updateScore();
  }
  start() {
    const animate = (time) => {
      const timeDelta = time - this.lastTime;
      this.lastTime = time;

      this.render(timeDelta);
      if (!this.over) {
        window.requestAnimationFrame(animate);
      } else {
        this.clearCanvas();
      }
    };
    animate(0);
    this.trackMoves();
  }
  trackCursor() {
    this.cursorPos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => (
      this.cursorPos = getCursorPos(this.ctx.canvas, e)
    ));

    document.addEventListener('touchmove', (e) => (
      this.cursorPos = getTouchPos(this.ctx.canvas, e)
    ));
  }
  trackMoves() {
    this.ctx.canvas.addEventListener('mousedown', () => this.beginMove());
    this.ctx.canvas.addEventListener('touchstart', (e) => {
      this.cursorPos = getTouchPos(this.ctx.canvas, e);
      this.beginMove();
    });

    window.addEventListener('mouseup', () => this.endMove());
    window.addEventListener('touchend', () => this.endMove());
  }
  updateHighScoreIfBeaten() {
    this.highScore = parseInt(localStorage.getItem(HIGH_SCORE), 10);
    this.newHighScore = false;
    if (this.score > this.highScore || Number.isNaN(this.highScore)) {
      this.newHighScore = true;
      this.highScore = this.score;
      localStorage.setItem(HIGH_SCORE, this.score);
    }
  }
  updateScore(points = 0) {
    this.score += points;
    this.movesLeft -= 1;
    this.gameTracker.score.textContent = this.score;
    this.gameTracker.movesLeft.textContent = this.movesLeft;
  }
}
