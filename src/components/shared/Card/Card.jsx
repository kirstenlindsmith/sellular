import { useMemo } from 'react';
import { useBreakpoint } from '../../../hooks';
import './Card.css';

const cardStyles = (width, fullWidth) => ({
  width: fullWidth ? '100%' : width ?? 'fit-content',
});

const Card = ({
  children,
  style,
  className,
  width,
  fullWidth,
  fullWidthAtBreakpoint,
  ...rest
}) => {
  const forceFullWidth = useBreakpoint(fullWidthAtBreakpoint);
  const bestStyles = useMemo(() => {
    const shouldForceFulLWidth = !!fullWidthAtBreakpoint && forceFullWidth;
    return {
      ...cardStyles(width, fullWidth || shouldForceFulLWidth),
      ...style,
    };
  }, [forceFullWidth, fullWidth, fullWidthAtBreakpoint, style, width]);

  return (
    <div className={`card ${className || ''}`} style={bestStyles} {...rest}>
      {children}
    </div>
  );
};

export default Card;
