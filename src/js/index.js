import SpotsGame from './Game';
import { queryEl } from './util';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = queryEl('#spots-game');
  new SpotsGame(canvas).start();

  queryEl('#new-game-btn').addEventListener('click', () => window.location.reload());
});
