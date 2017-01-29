import Board from './Board';
import View from './View';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');

    this.board = new Board();
  }
  render() {
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);

    this.board.draw(this.ctx);
  }
  start() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}
