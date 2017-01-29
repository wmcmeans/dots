export default class Line {
  constructor({ startSpot, cursorPos }) {
    this.startSpot = startSpot;
    this.cursorPos = cursorPos;
  }
  destroy() {
    console.log('destroy mee!!!!');
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startSpot.canvasPos.cx, this.startSpot.canvasPos.cx);
    if (this.endSpot) {
      ctx.lineTo(this.endSpot.canvasPos.cx, this.endSpot.canvasPos.cy);
    } else {
      ctx.lineTo(this.cursorPos.x, this.cursorPos.y);
    }
    ctx.stroke();
  }
  forgeConnection(endSpot) {
    this.endSpot = endSpot;
  }
}
