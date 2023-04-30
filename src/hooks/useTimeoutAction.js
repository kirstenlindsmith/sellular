import { useCallback, useEffect } from 'react';

let timeout;

export const useTimeoutAction = (
  callback, //memoized callback to be executed after delay
  delay = 500 //milliseconds after which callback fires
) => {
  useEffect(() => {
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  const handleAction = useCallback(
    (...args) => {
      timeout = setTimeout(() => callback?.(...args), delay);
    },
    [callback, delay]
  );

  return handleAction;
};

export default useTimeoutAction;
