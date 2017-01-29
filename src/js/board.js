import Spot from './Spot';
import { randomColor } from './util';

export default class Board {
  constructor() {
    this.selectedSpots = [];
    this.setup();
  }
  setup() {
    this.grid = [];

    for (let x = 0; x < 6; x++) {
      const column = [];
      for (let y = 0; y < 6; y++) {
        const spot = new Spot({
          pos: [x, y],
          color: randomColor(),
        });
        column.push(spot);
      }
      this.grid.push(column);
    }
  }
}
