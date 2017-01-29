import Board from './Board';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');

    this.trackCursor();

    this.board = new Board();
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
  }
  trackCursor() {
    this.cursorPos = { x: 0, y: 0 };
    const getCursorPos = (event) => {
      event.preventDefault();
      event.stopPropagation();

      // parseInt????
      const x = event.clientX - this.ctx.canvas.offsetLeft;
      const y = event.clientY - this.ctx.canvas.offsetTop;
      this.cursorPos = { x, y };
    };

    document.addEventListener('mousemove', getCursorPos);
  }
}
