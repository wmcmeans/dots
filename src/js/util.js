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

export const fixCanvasBlur = (canvas) => {
  const context = canvas.getContext('2d');
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = `${oldWidth}px`;
    canvas.style.height = `${oldHeight}px`;

    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    context.scale(ratio, ratio);
  }
};

export const getCursorPos = (canvas, event) => {
  event.preventDefault();
  event.stopPropagation();

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  return { x, y };
};

export const getColorAtReducedOpacity = (color, opacity = 0.5) => {
  const opacityIdx = color.length - 2;
  return `${color.slice(0, opacityIdx)}${opacity})`;
};
