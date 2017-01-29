export default class SpotsGame {
  constructor(canvas) {
    this.xDim = canvas.offsetWidth;
    this.yDim = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
  }
  render() {
    // clear board
    this.ctx.clearRect(0, 0, this.xDim, this.yDim);

    // change this to render the board
    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, 500, 500);
  }
  start() {
    const animate = () => {
      this.render();
      requestAnimationFrame(animate);
    };
    animate();
  }
}
