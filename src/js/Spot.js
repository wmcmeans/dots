import { DELTAS } from './constants';

export default class Spot {
  constructor({ pos, color }) {
    this.pos = pos;
    this.color = color;
    this.setInactive();
    // this.radiusPct = 0.22;
  }
  canConnectWith(otherSpot) {
    const neighbor = this.isNeighboring(otherSpot.pos);
    const sameColor = this.color === otherSpot.color;

    return neighbor && sameColor;
  }
  draw(ctx, sizeOfSpace, cursorPos) {
    this.setCanvasPos(sizeOfSpace);

    if (this.isHead && !this.isMouseOver(cursorPos)) {
      // console.log(`mouse over [${this.pos.x}, ${this.pos.y}] (${this.color})`);
      // console.log(`mouse exited [${this.pos.x}, ${this.pos.y}] (${this.color})`);
      this.setInactive();
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.canvasPos.cx, this.canvasPos.cy, this.canvasPos.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  isNeighboring(otherPos) {
    return Object.entries(DELTAS).find(([delta, { x, y }]) => {
      if (this.pos.x + x === otherPos.x && this.pos.y + y === otherPos.y) {
        return delta;
      }
      return false;
    });
  }
  setActive() {
    this.isHead = true;
    this.radiusPct = 0.25;
  }
  setCanvasPos(sizeOfSpace) {
    this.canvasPos = {
      cx: this.pos.x * sizeOfSpace + (sizeOfSpace / 2),
      cy: this.pos.y * sizeOfSpace + (sizeOfSpace / 2),
      radius: sizeOfSpace * this.radiusPct,
    };
  }
  setInactive() {
    this.isHead = false;
    this.radiusPct = 0.22;
  }
  isMouseOver(cursorPos) {
    const dx = cursorPos.x - this.canvasPos.cx;
    const dy = cursorPos.y - this.canvasPos.cy;
    return (dx * dx + dy * dy) <= (this.canvasPos.radius * this.canvasPos.radius);
  }
}
