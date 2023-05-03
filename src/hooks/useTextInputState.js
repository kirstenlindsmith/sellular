import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultTextInputState } from '../constants';
import useTimeoutEffect from './useTimeoutEffect';

const fieldIsEmpty = (value, minLength = 1) =>
  !value?.length || (value?.length ?? 0) < minLength;

const defaultOptions = {
  initialValue: '',
  required: false,
  requiredText: 'Required',
  normalizer: (value) => value,
  validation: (_value) => undefined,
  debounceDelay: 700,
};

//NOTE: this is a pared-down version of the custom hook I've developed for string form states.
export const useTextInputState = (options = defaultOptions) => {
  const {
    initialValue,
    required,
    requiredText,
    normalizer,
    validation,
    debounceDelay,
  } = { ...defaultOptions, ...options };

  const firstInitialValue = useRef(initialValue);
  const [value, setValue] = useState(
    initialValue ?? defaultTextInputState.value
  );
  const [everChanged, setEverChanged] = useState(defaultTextInputState.changed);
  const [changed, setChanged] = useState(defaultTextInputState.changed);
  const [error, setError] = useState(defaultTextInputState.error);
  const [overrideShowError, setOverrideShowError] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  const updateValue = useCallback(() => setDebouncedValue(value), [value]);
  useTimeoutEffect({
    callback: updateValue, //when callback changes, timer will restart
    debounceDelay,
  });

  const valid = useMemo(
    () =>
      !error?.length &&
      !validation?.(value)?.length &&
      (required ? !fieldIsEmpty(value) : true),
    [error?.length, required, validation, value]
  );

  const runValidation = useMemo(() => {
    if (overrideShowError) return true;
    return everChanged && value === debouncedValue;
  }, [overrideShowError, everChanged, value, debouncedValue]);

  const handleSetValue = useCallback(
    (value) => setValue(normalizer?.(value) ?? value),
    [normalizer]
  );

  const forceError = useCallback(() => setOverrideShowError(true), []);

  const reset = useCallback(() => {
    setError(null);
    setChanged(false);
    setEverChanged(false);
    setOverrideShowError(false);
    setValue(initialValue ?? '');
  }, [initialValue]);

  //handle potential initialValue load delay
  useEffect(() => {
    if (initialValue !== firstInitialValue.current) {
      setValue(initialValue ?? '');
    }
  }, [initialValue]);

  useEffect(() => {
    if (value !== (initialValue ?? '') && !changed) {
      setChanged(true);
      setEverChanged(true);
      setOverrideShowError(false);
    } else if (changed && value === (initialValue ?? '')) {
      setChanged(false);
    }
    if (validation && runValidation && !!validation(debouncedValue)?.length) {
      setError(validation(debouncedValue));
    } else if (required && runValidation && debouncedValue.length < 1) {
      setError(requiredText || 'Required');
    } else if (
      //a required input has text (and needs validation; allows hiding the error manually)
      (required && runValidation && !fieldIsEmpty(debouncedValue)) ||
      //or, a field that used to be required was programmatically updated to no longer be required
      (!required &&
        (error === 'Required' || (requiredText && error === requiredText))) ||
      //validation no longer returning an error message
      (validation && runValidation && !validation(debouncedValue)?.length) ||
      //interact type triggering validation has been manually reset
      (validation && !runValidation && !!error?.length)
    ) {
      setError(null);
      if (overrideShowError) setOverrideShowError(false);
    }
  }, [
    debouncedValue,
    runValidation,
    required,
    requiredText,
    validation,
    error,
    initialValue,
    changed,
    value,
    overrideShowError,
  ]);

  return {
    value,
    debouncedValue,
    setValue: handleSetValue,
    reset,
    changed,
    error,
    setError,
    forceError,
    valid,
  };
};

export default useTextInputState;
