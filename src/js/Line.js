export default class Line {
  constructor(startSpot) {
    this.startSpot = startSpot;
  }
  destroy() {
    console.log('destroy mee!!!!');
  }
  draw(ctx, cursorPos) {
    ctx.strokeStyle = this.startSpot.color;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(this.startSpot.canvasPos.cx, this.startSpot.canvasPos.cy);
    if (this.endSpot) {
      ctx.lineTo(this.endSpot.canvasPos.cx, this.endSpot.canvasPos.cy);
    } else {
      ctx.lineTo(cursorPos.x, cursorPos.y);
    }
    ctx.stroke();
  }
  forgeConnection(endSpot) {
    this.endSpot = endSpot;
  }
}
