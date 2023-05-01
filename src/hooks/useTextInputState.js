import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

const fieldIsEmpty = (value, minLength = 1) =>
  !value?.length || (value?.length ?? 0) < minLength;

const defaultOptions = {
  initialValue: '',
  required: false,
  requiredText: 'Required',
  minLength: undefined,
  normalizer: (value) => value,
  validation: (_value) => undefined,
  validateOn: 'debounce', //'touch', 'blur', 'debounce', 'debounceTouch'
  debounceDelay: 700,
};

export const useTextInputState = (options = defaultOptions) => {
  const {
    initialValue,
    required,
    requiredText,
    minLength,
    normalizer,
    validation,
    validateOn,
    debounceDelay,
  } = { ...defaultOptions, ...options };

  const firstInitialValue = useRef(initialValue);
  const [value, setValue] = useState(initialValue ?? '');
  const [everChanged, setEverChanged] = useState(false);
  const [changed, setChanged] = useState(false);
  const [touched, setTouched] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [error, setError] = useState();
  const [overrideShowError, setOverrideShowError] = useState(false);
  const debouncedValue = useDebounce(value, debounceDelay);

  const valueToValidate = useMemo(
    () =>
      validateOn === 'debounce' || validateOn === 'debounceTouch'
        ? debouncedValue
        : value,
    [validateOn, debouncedValue, value]
  );

  const valid = useMemo(
    () =>
      !error?.length &&
      !validation?.(value)?.length &&
      (required ? !fieldIsEmpty(value, minLength) : true),
    [error?.length, minLength, required, validation, value]
  );

  const runValidation = useMemo(() => {
    if (overrideShowError) return true;
    switch (validateOn) {
      case 'blur':
        return blurred;
      case 'debounce':
        return everChanged && value === debouncedValue;
      case 'debounceTouch':
        return touched && value === debouncedValue;
      case 'touch':
      default:
        return touched;
    }
  }, [
    overrideShowError,
    validateOn,
    blurred,
    everChanged,
    value,
    debouncedValue,
    touched,
  ]);

  const setInteract = useCallback(
    (userHasInteracted) => {
      validateOn === 'blur'
        ? setBlurred(userHasInteracted)
        : setTouched(userHasInteracted);
    },
    [validateOn]
  );

  const handleSetValue = useCallback(
    (value) => setValue(normalizer?.(value) ?? value),
    [normalizer]
  );

  const forceError = useCallback(() => setOverrideShowError(true), []);

  const reset = useCallback(() => {
    setError(null);
    setBlurred(false);
    setTouched(false);
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
    if (!fieldIsEmpty(valueToValidate)) {
      setTouched(true);
    }
    if (validation && runValidation && !!validation(valueToValidate)?.length) {
      setError(validation(valueToValidate));
    } else if (
      required &&
      runValidation &&
      valueToValidate.length < (minLength ?? 1)
    ) {
      if ((minLength ?? 1) > 1) {
        setError(`Minimum ${minLength ?? 2} characters`);
      } else setError(requiredText || 'Required');
    } else if (
      //a required input has text (and needs validation; allows hiding the error manually)
      (required &&
        runValidation &&
        !fieldIsEmpty(valueToValidate, minLength)) ||
      //or, a field that used to be required was programmatically updated to no longer be required
      (!required &&
        (error === 'Required' || (requiredText && error === requiredText))) ||
      //validation no longer returning an error message
      (validation && runValidation && !validation(valueToValidate)?.length) ||
      //interact type triggering validation has been manually reset
      (validation && !runValidation && !!error?.length)
    ) {
      setError(null);
      if (overrideShowError) setOverrideShowError(false);
    }
  }, [
    valueToValidate,
    runValidation,
    minLength,
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
    interact:
      validateOn === 'blur'
        ? blurred
        : validateOn === 'debounce'
        ? everChanged
        : touched,
    setInteract,
    changed,
    touched,
    setTouched,
    blurred,
    setBlurred,
    error,
    setError,
    forceError,
    valid,
  };
};

export default useTextInputState;
