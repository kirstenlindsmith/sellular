import { useCallback, useEffect, useRef, useState } from 'react';

//NOTE: determines whether an element is truncated
export const useOverflowWatcher = (watch) => {
  const componentRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  const measureOverflow = useCallback(() => {
    if (componentRef?.current) {
      const component = componentRef.current;
      setOverflows(
        (component?.scrollHeight ?? 0) > (component?.clientHeight ?? 0) ||
          (component?.scrollWidth ?? 0) > (component?.clientWidth ?? 0)
      ); //NOTE: 'scroll' height/width is the total content of a trundated element (e.g., the overflow auto/scroll accessible portion)
      //whereas the client height/width is the content portion rendered by the client/browser.
      //thus a truncated element is larger undearneath (from a scrollbar's perspective) than its rendered size
    }
  }, []);

  useEffect(() => {
    measureOverflow();
  }, [watch, measureOverflow]); //could optionally re-measure based on a custom trigger

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
