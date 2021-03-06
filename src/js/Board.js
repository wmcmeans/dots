import Spot from './Spot';
import Line from './Line';
import { randomColor } from './util';

export default class Board {
  constructor() {
    this.selectedSpots = [];
    this.lines = [];
    this.moveColor = undefined;
    this.setup();
  }
  addAllSpotsOfColorToMove() {
    const moveColor = this.selectedSpots[0] && this.selectedSpots[0].color;
    this.grid.forEach(row => {
      row.forEach(spot => {
        if (spot.color === moveColor && !this.selectedSpots.find(selected => selected === spot)) {
          this.selectedSpots.push(spot);
        }
      });
    });
  }
  addSpotToMove(spot) {
    spot.setActive();
    const line = new Line(spot);
    if (this.selectedSpots.length) {
      this.getTailSpot().setInactive();
      this.getTailLine().forgeConnection(spot);
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
    const tail = this.getTailSpot();
    if (activeSpot && activeSpot !== tail && tail.canConnectWith(activeSpot)) {
      const connectionAreadyExists = this.lines.find(({ startSpot, endSpot }) => (
        (startSpot === tail && endSpot === activeSpot) ||
        (startSpot === activeSpot && endSpot === tail)
      ));

      const spotBeforeTail = this.getSpotBeforeTail();
      if (spotBeforeTail && spotBeforeTail === activeSpot) {
        this.removeLastConnection();
        this.checkForSquares();
      } else if (!connectionAreadyExists) {
        this.addSpotToMove(activeSpot);
        this.checkForSquares();
      }
    }
  }
  checkForSquares() {
    const seenSpots = new Set();
    let squared = false;
    this.lines.forEach(({ startSpot }) => {
      const posAsString = `${startSpot.pos.x}-${startSpot.pos.y}`;
      if (seenSpots.has(posAsString)) {
        squared = true;
      }
      seenSpots.add(posAsString);
    });

    this.moveColor = this.selectedSpots[0] && this.selectedSpots[0].color;
    this.grid.forEach(row => {
      row.forEach(spot => {
        if (spot.color === this.moveColor && squared) {
          spot.setActive();
        } else if (!this.selectedSpots.find(selected => selected === spot)) {
          spot.setInactive();
        }
      });
    });

    this.squared = squared;
  }
  clearMove() {
    this.selectedSpots = [];
    this.lines = [];
  }
  draw(ctx, cursorPos, timeDelta) {
    this.squareSize = ctx.canvas.offsetWidth / this.grid.length;

    if (this.moving) {
      this.checkForNewConnections(cursorPos);
    }

    this.grid.forEach(row => (
      row.forEach(spot => spot.draw(ctx, this.squareSize, cursorPos, timeDelta))
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
  getTailLine() {
    return this.lines[this.lines.length - 1];
  }
  getTailSpot() {
    return this.selectedSpots[this.selectedSpots.length - 1];
  }
  getSpotBeforeTail() {
    if (this.selectedSpots.length < 2) return null;
    return this.selectedSpots[this.selectedSpots.length - 2];
  }
  removeLastConnection() {
    this.selectedSpots.pop();
    this.lines.pop();
    const lastLine = this.lines[this.lines.length - 1];
    if (lastLine.endSpot) {
      lastLine.destroyConnection();
    }
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
    if (this.squared) {
      this.addAllSpotsOfColorToMove();
    }
    this.squared = false;

    const points = this.selectedSpots.length;
    this.selectedSpots.forEach(spot => {
      const { x: column, y: row } = spot.pos;
      this.grid[row][column] = null;
      for (let y = row; y > 0; y--) {
        // this swaps out the positions of the spots so that it shifts them "down" (higher index)
        this.grid[y][column] = this.grid[y - 1][column];
        this.grid[y - 1][column] = null;
        this.grid[y][column].pos.y = y;

        if (this.grid[y][column]) {
          this.grid[y][column].animateFromPreviousHeight(y - 1);
        }
      }
      const replacementPos = { x: column, y: 0 };
      const replacementSpot = new Spot({ pos: replacementPos, color: randomColor() });
      this.grid[0][column] = replacementSpot;
      replacementSpot.animateFromPreviousHeight(-1);
    });
    this.clearMove();
    return points;
  }
}
