import { useCallback, useMemo, useState } from 'react';
import { colors } from '../../constants';
import { bestTextColor, interactColor } from '../../helpers';

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

const buttonStyles = (color, textColor, size, disabled, fullWidth) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  borderRadius: '6px',
  padding: '0.25rem 0.5rem',
  opacity: disabled ? 0.4 : 1,
  backgroundColor: color,
  color: textColor ?? bestTextColor(color),
  width: fullWidth ? '100%' : 'auto',
  height: 'fit-content',
  letterSpacing: '0.01rem',
  minHeight: buttonSizes[size].minHeight ?? buttonSizes.medium.minHeight,
  fontWeight: buttonSizes[size].fontWeight ?? buttonSizes.medium.fontWeight,
  fontSize: buttonSizes[size].fontSize ?? buttonSizes.medium.fontSize,
});

const hiddenOnLoadStyle = (loading) => ({
  opacity: loading ? 0 : 1,
  visibility: loading ? 'hidden' : 'visible',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.25rem',
});

const Button = ({
  children,
  color = colors.teal,
  textColor,
  size = 'medium',
  fullWidth,
  style,
  onClick,
  loading,
  disabled,
  ...props
}) => {
  const [currentColor, setCurrentColor] = useState(color);

  const currentStyle = useMemo(
    () => ({
      ...buttonStyles(currentColor, textColor, size, disabled, fullWidth),
      ...(style ?? {}),
    }),
    [currentColor, disabled, fullWidth, size, style, textColor]
  );

  const handleInteract = useCallback(
    (direction) => () => {
      if (direction === 'in') {
        setCurrentColor(interactColor(color ?? colors.teal));
      } else if (direction === 'out') setCurrentColor(color ?? colors.teal);
    },
    [color]
  );

  return (
    <button
      aria-disabled={disabled}
      disabled={disabled || loading}
      onClick={props.type === 'submit' ? undefined : onClick}
      style={currentStyle}
      onMouseOver={handleInteract('in')}
      onMouseOut={handleInteract('out')}
      {...props}
    >
      {loading && 'Loading...'}
      <div
        className='button-content'
        style={hiddenOnLoadStyle(loading)}
        aria-hidden={loading}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
