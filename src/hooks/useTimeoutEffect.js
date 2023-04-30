import { useEffect } from 'react';

export const useTimeoutEffect = ({
  callback, //memoized callback to be executed after delay
  delay = 500, //milliseconds after which callback fires
  active = true, //triggers the timeout countdown to start
  watch = [], //additional dependencies that will restart the timer
}) => {
  useEffect(() => {
    let timeout;
    if (active) timeout = setTimeout(callback, delay);
    return () => {
      timeout && clearTimeout(timeout);
    };
    //exhaustive deps disabled to enable ...watch spread
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, callback, delay, ...watch]);
};

export default useTimeoutEffect;
