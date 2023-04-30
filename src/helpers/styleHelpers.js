import { colors } from '../constants';

export const getUserFontSize = () => {
  const localFontSize = parseFloat(
    getComputedStyle(document?.documentElement)?.fontSize
  );
  if (Number.isNaN(localFontSize)) {
    throw new Error('Error accessing browser font size');
  }
  return localFontSize;
};

export const addHexOpacity = (
  color,
  opacityPercentage = 0.5 /* number between 0-1 */
) => {
  if (!color || opacityPercentage < 0 || opacityPercentage > 1) return color;

  if (opacityPercentage > 1 || opacityPercentage < 0) return color;
  const opacity = Math.round(
    Math.min(Math.max(opacityPercentage || 1, 0), 1) * 255
  );
  return `${color}${opacity.toString(16)}`.toUpperCase();
};

const findHexBrightness = (color) => {
  if (!color) return 0;

  const colorVal = parseInt(color.replace('#', ''), 16);
  //tone-indifferent extractions to determine shade
  const extractR = (colorVal >> 16) & 0xff;
  const extractG = (colorVal >> 8) & 0xff;
  const extractB = (colorVal >> 0) & 0xff;
  const brightness = 0.2126 * extractR + 0.7152 * extractG + 0.0722 * extractB;
  return brightness;
};

export const changeHexColor = (color, percent) => {
  if (!color || !percent) return color;

  let workingColor = color;
  if (color === 'transparent') {
    workingColor = colors.white;
  }
  let workingPercent = percent;
  const colorVal = parseInt(workingColor.replace('#', ''), 16);
  const brightness = findHexBrightness(workingColor);

  //if the color is too dark to be darkened, or too light to be lightened, reverse the goal shade
  if ((brightness < 60 && percent < 0) || (brightness > 225 && percent > 0)) {
    workingPercent = -percent;
  }

  //tone-preserving color conversion
  const changeAmount = Math.round(2.55 * workingPercent); //account for 0-255 instead of 0-100 color scale
  const R = (colorVal >> 16) + changeAmount;
  const G = (colorVal & 0x0000ff) + changeAmount;
  const B = ((colorVal >> 8) & 0x00ff) + changeAmount;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + //if R/G/B are too dark or too light, set to limit
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16) //convert back to hex string
      .slice(1) //remove inevitable leading 1
  );
};

export const interactColor = (color) => changeHexColor(color, -10);
