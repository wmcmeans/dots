import Board from './Board';
import {
  fixCanvasBlur,
  getCursorPos,
  getTouchPos,
  getColorAtReducedOpacity,
  queryEl,
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
  end() {
    this.over = true;
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
  updateScore(points = 0) {
    this.score += points;
    this.movesLeft -= 1;
    this.gameTracker.score.textContent = this.score;
    this.gameTracker.movesLeft.textContent = this.movesLeft;
  }
}
