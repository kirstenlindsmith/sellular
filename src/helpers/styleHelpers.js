import { colors } from '../constants';

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
export const getLoaderDisplayTime = () => randomNumber(500, 1200);

const findHexBrightness = (color) => {
  if (!color) return 0;

  const colorVal = parseInt(color.replace('#', ''), 16);

  /*(NOTE: this bitwise magic is something I found on stack overflow) 3+ years ago when
  researching how to do programmatic color manipulation. Closest source I can find now
  for context is: https://stackoverflow.com/questions/6126439/what-does-0xff-do */
  const extractR = (colorVal >> 16) & 0xff; //tone-indifferent extractions to determine shade
  const extractG = (colorVal >> 8) & 0xff;
  const extractB = (colorVal >> 0) & 0xff;

  //NOTE: the equation for perceived brightness comes from https://en.wikipedia.org/wiki/Relative_luminance
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
  //NOTE: these numbers are something I developed years ago through trial and error
  if ((brightness < 60 && percent < 0) || (brightness > 225 && percent > 0)) {
    workingPercent = -percent;
  }

  /*NOTE: I developed this logic 3+ years ago and can't find the sources I'd used.
  But I did find a pretty good and more-recently discussion on this type of thing here:
  https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  */
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

const shouldUseBlackText = (color = colors.teal) => {
  let workingColor = color;
  if (color.slice(0, 6) === 'var(--') {
    workingColor = colors[color.slice(6, color.length - 1)];
  }

  if (
    !workingColor ||
    workingColor === colors.white ||
    workingColor === 'transparent'
  )
    return true;

  return findHexBrightness(workingColor) > 190; //NOTE: 190 is a number I chose on my own through experimentation
};

export const bestTextColor = (color = colors.teal) =>
  shouldUseBlackText(color) ? colors.black : colors.white;
