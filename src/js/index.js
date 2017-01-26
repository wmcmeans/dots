import DotsView from './dotsView';
import { queryEl } from './util';

document.on('DOMContentLoaded', () => {
  const rootEl = queryEl('.dots-game');
  new DotsView(rootEl);
});
