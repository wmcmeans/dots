import Board from './Board';
import { fixCanvasBlur, getCursorPos, queryEl } from './util';

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
  beginMove() {
    this.moving = true;
    this.board.beginMove(this.cursorPos);
  }
  endMove() {
    this.moving = false;
    const points = this.board.endMove();
    if (points) {
      this.updateScore(points);
    }
  }
  render(timeDelta) {
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);

    this.board.draw(this.ctx, this.cursorPos, timeDelta);
  }
  setupScoreBoard() {
    this.gameTracker = {
      score: queryEl('#score'),
      movesLeft: queryEl('#moves-left'),
    };
    this.score = 0;
    this.movesLeft = 31;
    this.updateScore();
  }
  start() {
    const animate = (time) => {
      const timeDelta = time - this.lastTime;
      this.lastTime = time;

      this.render(timeDelta);
      requestAnimationFrame(animate);
    };
    animate(0);
    this.trackMoves();
  }
  trackCursor() {
    this.cursorPos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => (
      this.cursorPos = getCursorPos(this.ctx.canvas, e)
    ));
  }
  trackMoves() {
    this.ctx.canvas.addEventListener('mousedown', () => this.beginMove());
    window.addEventListener('mouseup', () => this.endMove());
  }
  updateScore(points = 0) {
    this.score += points;
    this.movesLeft -= 1;
    this.gameTracker.score.textContent = this.score;
    this.gameTracker.movesLeft.textContent = this.movesLeft;
  }
}
