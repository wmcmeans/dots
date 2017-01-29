// import SpotsGame from './game';
import SpotsGame from './spotsGame';
import { queryEl } from './util';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = queryEl('#spots-game');
  new SpotsGame(canvas).start();
});
