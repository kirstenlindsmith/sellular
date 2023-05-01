import { useCallback, useEffect, useRef, useState } from 'react';

export const useOverflowWatcher = ({ watch } = {}) => {
  const componentRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  const measureOverflow = useCallback(() => {
    if (componentRef?.current) {
      const component = componentRef.current;
      setOverflows(
        (component?.scrollHeight ?? 0) > (component?.clientHeight ?? 0) ||
          (component?.scrollWidth ?? 0) > (component?.clientWidth ?? 0)
      );
    }
  }, []);

  useEffect(() => {
    measureOverflow();
  }, [watch, measureOverflow]);

  useEffect(() => {
    window.addEventListener('resize', measureOverflow);
    window.addEventListener('focus', measureOverflow);
    return () => {
      window.removeEventListener('resize', measureOverflow);
      window.removeEventListener('focus', measureOverflow);
    };
  }, [measureOverflow]);

  return {
    componentRef,
    overflows,
  };
};

export default useOverflowWatcher;
