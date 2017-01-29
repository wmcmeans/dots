import Board from './Board';
import View from './View';

export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
  }
  render() {
    // clear board
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);

    // change this to render the view using the board (logic)
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, 20, 20);
  }
  start() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}
