import Board from './Board';
import { fixCanvasBlur, getCursorPos } from './util';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
    fixCanvasBlur(canvas);

    this.trackCursor();

    this.board = new Board();
    this.score = 0;
  }
  beginMove() {
    this.moving = true;
    this.board.beginMove(this.cursorPos);
  }
  endMove() {
    this.moving = false;
    const points = this.board.endMove();
    if (points) {
      this.score += points;
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);

    this.board.draw(this.ctx, this.cursorPos);
  }
  start() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
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
}
