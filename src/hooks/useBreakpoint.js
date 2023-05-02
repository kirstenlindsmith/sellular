import { useEffect, useState } from 'react';
import { breakpoints } from '../constants';

export const useBreakpoint = (targetBreakpoint = breakpoints.mobile) => {
  const [hitBreakpoint, setHitBreakpoint] = useState(false);

  useEffect(() => {
    const checkViewportWidth = () => {
      const currentWidth = window?.innerWidth ?? 0;
      setHitBreakpoint(currentWidth <= targetBreakpoint);
    };
    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, [targetBreakpoint]);

  return hitBreakpoint;
};
