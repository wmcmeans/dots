import { COLORS_ARRAY, DELTAS } from './constants';

export const queryEl = selector => (document.querySelector(selector));
export const queryElAll = selector => (document.querySelectorAll(selector));

export const randomColor = () => {
  const idx = Math.floor(Math.random() * 5);
  return COLORS_ARRAY[idx];
};

export const getOppositeDelta = (delta) => {
  switch (delta) {
    case 'top':
      return 'bottom';
    case 'right':
      return 'left';
    case 'bottom':
      return 'top';
    case 'left':
      return 'right';
    default:
      throw new Error('delta not found in list of deltas');
  }
};
