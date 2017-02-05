import SpotsGame from './Game';
import { queryEl } from './util';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = queryEl('#spots-game');
  const game = new SpotsGame(canvas);
  game.start();

  queryEl('#new-game-btn').addEventListener('click', () => window.location.reload());
});
