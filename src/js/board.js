import Spot from './Spot';
import { randomColor } from './util';

export default class Board {
  constructor() {
    this.selectedSpots = [];
    this.setup();
  }
  draw(ctx) {
    this.grid.forEach(row => (
      row.forEach(spot => spot.draw(ctx))
    ));
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
