import { useCallback, useMemo, useRef, useState } from 'react';
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
  lineHeight: 1,
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
  textColor = colors.white,
  size = 'medium',
  fullWidth,
  style,
  onClick,
  loading,
  disabled,
  hidden,
  className,
  ...props
}) => {
  const buttonRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentTextColor, setCurrentTextColor] = useState(textColor);

  const currentStyle = useMemo(
    () => ({
      ...buttonStyles(
        currentColor,
        currentTextColor,
        size,
        disabled || hidden,
        fullWidth
      ),
      ...(style ?? {}),
    }),
    [currentColor, currentTextColor, disabled, fullWidth, hidden, size, style]
  );

  const handleInteract = useCallback(
    (direction) => () => {
      if (hidden || disabled) return;
      const icons = buttonRef.current?.querySelectorAll('svg');
      if (direction === 'in') {
        setCurrentColor(interactColor(color));
        if (color === 'transparent') {
          setCurrentTextColor(interactColor(textColor));
          [...icons].forEach((icon) => {
            if (!!icon?.style) {
              icon.setAttribute('fill', interactColor(textColor));
              icon.style.color = interactColor(textColor);
            }
          });
        }
      } else if (direction === 'out') {
        setCurrentColor(color);
        if (color === 'transparent') {
          setCurrentTextColor(textColor);
          [...icons].forEach((icon) => {
            if (!!icon?.style) {
              icon.setAttribute('fill', textColor);
              icon.style.color = textColor;
            }
          });
        }
      }
    },
    [color, disabled, hidden, textColor]
  );

  const handleClick = useCallback(() => {
    if (props.type === 'submit' || disabled || hidden) return;
    else onClick?.();
  }, [disabled, hidden, onClick, props.type]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      style={currentStyle}
      aria-hidden={hidden}
      aria-disabled={disabled || hidden}
      disabled={disabled || loading}
      onMouseOver={handleInteract('in')}
      onMouseOut={handleInteract('out')}
      tabIndex={hidden ? -1 : undefined}
      className={`${className || ''} ${hidden ? 'hidden' : ''}`}
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
