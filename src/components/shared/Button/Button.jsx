import { useCallback, useMemo, useRef, useState } from 'react';
import { colors } from '../../../constants';
import { interactColor } from '../../../helpers';
import { overrideButtonStyles } from './buttonHelpers';
import './Button.css';

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
      ...overrideButtonStyles(
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
      if (hidden || disabled) return; //if button is interactable...
      const icons = buttonRef.current?.querySelectorAll('svg');
      if (direction === 'in') {
        //on hover
        setCurrentColor(interactColor(color)); //adjust the bg color to show interaction
        if (color === 'transparent') {
          //and darken the text and icon(s) for extra contrast on transparent buttons
          setCurrentTextColor(interactColor(textColor));
          [...icons].forEach((icon) => {
            if (!!icon?.style) {
              icon.setAttribute('fill', interactColor(textColor));
              icon.style.color = interactColor(textColor);
            }
          });
        }
      } else if (direction === 'out') {
        //else, when done hovering
        setCurrentColor(color); //reset the bg color
        if (color === 'transparent') {
          setCurrentTextColor(textColor); //and the text/icon color
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
      className={`center button-container ${className || ''} ${
        hidden ? 'hidden' : ''
      }`}
      {...props}
    >
      {loading && (
        <div className='ellipsis-loader-container'>
          <div className='ellipsis-loader-text'>Loading</div>
          <div aria-hidden='true' className='ellipsis-width-placeholder'>
            Loading...
          </div>
        </div>
      )}
      <div
        className={`center button-content ${loading ? 'loading' : ''}`}
        aria-hidden={loading}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
