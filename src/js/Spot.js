export default class Spot {
  constructor({ pos, color }) {
    this.pos = pos;
    this.color = color;
  }
  draw(ctx) {
    // TODO: instead of dividing by six, come up with a less brittle way of getting
    // the number of spots per row/col
    const sizeOfSpace = ctx.canvas.offsetWidth / 6;
    const center = sizeOfSpace / 2;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos.x * sizeOfSpace + center,
      this.pos.y * sizeOfSpace + center,
      sizeOfSpace * 0.22,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
