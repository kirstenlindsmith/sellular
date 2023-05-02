import { useEffect, useMemo, useRef, useState } from 'react';
import { getUserFontSize } from '../helpers';

//NOTE: default breakpoint should always be a pixel value appropriate for browser default 1rem = 16px
export const usePageWrapWatcher = (defaultWrapBreakpoint = 760) => {
  const [pageWraps, setPageWraps] = useState(undefined);
  const containerRef = useRef(null);

  const breakpointForUserFont = useMemo(() => {
    const breakpointRatio = defaultWrapBreakpoint / 16;
    return getUserFontSize() * breakpointRatio;
  }, [defaultWrapBreakpoint]);

  useEffect(() => {
    const checkIfPageWraps = () => {
      setPageWraps(
        (containerRef.current?.clientWidth ?? 0) <= breakpointForUserFont
      );
    };
    checkIfPageWraps();
    window.addEventListener('resize', checkIfPageWraps);
    return () => window.removeEventListener('resize', checkIfPageWraps);
  }, [breakpointForUserFont]);

  return {
    containerRef,
    pageWraps,
  };
};

export default usePageWrapWatcher;
