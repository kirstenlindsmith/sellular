import { useEffect } from 'react';

let timeout;

//NOTE: automatically debounce a callback while passively watching a trigger
export const useTimeoutEffect = ({
  //(named key/value params just makes this a little easier to use IMO)
  callback, //memoized callback to be executed after delay
  delay = 500, //milliseconds after which callback fires
  active = true, //triggers the timeout countdown to start
  watch = [], //additional dependencies that will restart the timer
}) => {
  useEffect(() => {
    if (active) timeout = setTimeout(callback, delay);
    return () => {
      timeout && clearTimeout(timeout);
    };
    //exhaustive deps disabled to enable ...watch spread
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, callback, delay, ...watch]);
};

export default useTimeoutEffect;
