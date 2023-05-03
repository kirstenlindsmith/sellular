import { bestTextColor } from '../../../helpers';

const buttonSizes = {
  small: {
    fontSize: '0.813rem',
    fontWeight: 550,
    minHeight: 'none',
  },
  medium: {
    fontSize: '0.875rem',
    fontWeight: 550,
    minHeight: '1.875rem',
  },
  large: {
    fontSize: '1rem',
    fontWeight: 600,
    minHeight: '2.25rem',
  },
};

export const overrideButtonStyles = (
  color,
  textColor,
  size,
  disabled,
  fullWidth
) => ({
  opacity: disabled ? 0.4 : 1,
  backgroundColor: color,
  color: textColor ?? bestTextColor(color),
  width: fullWidth ? '100%' : 'auto',
  minHeight: buttonSizes[size].minHeight ?? buttonSizes.medium.minHeight,
  fontWeight: buttonSizes[size].fontWeight ?? buttonSizes.medium.fontWeight,
  fontSize: buttonSizes[size].fontSize ?? buttonSizes.medium.fontSize,
});
