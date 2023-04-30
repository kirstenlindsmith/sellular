import { useCallback, useState } from 'react';
import useTimeoutEffect from './useTimeoutEffect';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const updateValue = useCallback(() => setDebouncedValue(value), [value]);
  useTimeoutEffect({
    callback: updateValue, //when callback changes, timer will restart
    delay,
  });

  return debouncedValue;
};

export default useDebounce;
