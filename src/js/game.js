import Board from './Board';
import { fixCanvasBlur } from './util';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
    fixCanvasBlur(canvas);

    this.trackCursor();

    this.board = new Board();
  }
  beginMove() {
    this.moving = true;
    this.board.beginMove(this.cursorPos);
  }
  endMove() {
    this.moving = false;
    console.log('ending');
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
    const getCursorPos = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const x = event.clientX - this.ctx.canvas.offsetLeft;
      const y = event.clientY - this.ctx.canvas.offsetTop;
      this.cursorPos = { x, y };
    };

    document.addEventListener('mousemove', getCursorPos);
  }
  trackMoves() {
    this.ctx.canvas.addEventListener('mousedown', () => this.beginMove());
    window.addEventListener('mouseup', () => this.endMove());
  }
}
