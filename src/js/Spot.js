export default class Spot {
  constructor({ pos, color }) {
    this.pos = pos;
    this.color = color;
    this.setInactive();
  }
  draw(ctx, sizeOfSpace, cursorPos) {
    this.setCanvasPos(sizeOfSpace);

    if (this.isMouseOver(cursorPos)) {
      console.log(`mouse over [${this.pos.x}, ${this.pos.y}] (${this.color})`);
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.canvasPos.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  setActive() {
    this.radiusPct = 0.25;
  }
  setInactive() {
    this.radiusPct = 0.22;
  }
  setCanvasPos(sizeOfSpace) {
    this.canvasPos = {
      cx: this.pos.x * sizeOfSpace + (sizeOfSpace / 2),
      cy: this.pos.y * sizeOfSpace + (sizeOfSpace / 2),
      radius: sizeOfSpace * this.radiusPct,
    };
  }
  isMouseOver(cursorPos) {
    const dx = cursorPos.x - this.canvasPos.cx;
    const dy = cursorPos.y - this.canvasPos.cy;
    return (dx * dx + dy * dy) <= (this.canvasPos.radius * this.canvasPos.radius);
  }
}
