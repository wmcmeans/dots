import Spot from './Spot';
import Line from './Line';
import { randomColor } from './util';

export default class Board {
  constructor() {
    this.selectedSpots = [];
    this.lines = [];
    this.setup();
  }
  addSpotToMove(spot) {
    spot.setActive();
    const line = new Line(spot);
    if (this.selectedSpots.length) {
      this.getHeadSpot().setInactive();
      this.getHeadLine().forgeConnection(spot);
    }
    this.selectedSpots.push(spot);
    this.lines.push(line);
  }
  beginMove(cursorPos) {
    this.moving = true;
    const firstSpot = this.findActiveSpot(cursorPos);
    if (firstSpot) {
      this.addSpotToMove(firstSpot);
    } else {
      this.endMove();
    }
  }
  cancelMove() {
    this.selectedSpots.forEach(spot => spot.setInactive());
    this.clearMove();
  }
  checkForNewConnections(cursorPos) {
    const activeSpot = this.findActiveSpot(cursorPos);
    const head = this.getHeadSpot();
    if (activeSpot && activeSpot !== head && head.canConnectWith(activeSpot)) {
      this.addSpotToMove(activeSpot);
    }
  }
  clearMove() {
    this.selectedSpots = [];
    this.lines = [];
  }
  draw(ctx, cursorPos) {
    this.squareSize = ctx.canvas.offsetWidth / this.grid.length;

    if (this.moving) {
      this.checkForNewConnections(cursorPos);
    }

    this.grid.forEach(row => (
      row.forEach(spot => spot.draw(ctx, this.squareSize, cursorPos))
    ));
    this.lines.forEach(line => line.draw(ctx, cursorPos));
  }
  endMove() {
    this.moving = false;
    if (this.selectedSpots.length > 1) {
      return this.tallyAndRemoveSpots();
    }
    return this.cancelMove();
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
  getHeadLine() {
    return this.lines[this.lines.length - 1];
  }
  getHeadSpot() {
    return this.selectedSpots[this.selectedSpots.length - 1];
  }
  shiftEmptySpaces(emptySpaces) {

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
  tallyAndRemoveSpots() {
    const points = this.selectedSpots.length;
    this.selectedSpots.forEach(spot => {
      const { x: column, y: row } = spot.pos;
      this.grid[row][column] = null;
      for (let y = row; y > 0; y--) {
        this.grid[y][column] = this.grid[y - 1][column];
        this.grid[y - 1][column] = null;
        this.grid[y][column].pos.y = y;
        // TODO: add a prevPos property;
      }
      const replacementPos = { x: column, y: 0 };
      const replacementSpot = new Spot({ pos: replacementPos, color: randomColor() });
      this.grid[0][column] = replacementSpot;
    });
    this.clearMove();
    return points;
  }
}
