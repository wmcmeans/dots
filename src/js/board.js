import Spot from './Spot';
import { randomColor } from './util';

export default class Board {
  constructor() {
    this.selectedSpots = [];
    this.setup();
  }
  beginMove(cursorPos) {
    const firstSpot = this.findActiveSpot(cursorPos);
    if (!firstSpot) return false;

    this.selectedSpots.push(firstSpot);
  }
  draw(ctx, cursorPos) {
    this.squareSize = ctx.canvas.offsetWidth / this.grid.length;

    this.grid.forEach(row => (
      row.forEach(spot => spot.draw(ctx, this.squareSize, cursorPos))
    ));
  }
  findActiveSpot(cursorPos) {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        const spot = this.grid[i][j];
        if (spot.isMouseOver(cursorPos)) return spot;
      }
    }

    return null;
  }
  setup() {
    this.grid = [];

    for (let y = 0; y < 6; y++) {
      const row = [];
      for (let x = 0; x < 6; x++) {
        const spot = new Spot({
          pos: { x, y },
          color: randomColor(),
        });
        row.push(spot);
      }
      this.grid.push(row);
    }
  }
}
