import { colorsArray } from './constants';

export const queryEl = selector => (document.querySelector(selector));
export const queryElAll = selector => (document.querySelectorAll(selector));

export const randomColor = () => {
  const idx = Math.floor(Math.random() * 5);
  return colorsArray[idx];
};
