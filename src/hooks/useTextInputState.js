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
    validation, //validation runs on debounce by default. usually I'd add multiple 'validateOn' mode options
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

  const updateValue = useCallback(() => setDebouncedValue(value), [value]); //callback only redefined if value changes
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

  //allow manually triggering validation even if normal condition hasn't been met
  //(e.g., for onSubmit validation when field hasn't been touched)
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

  //handle actual field logic
  useEffect(() => {
    //if the value has changed but the change hasn't been recorded yet...
    if (value !== (initialValue ?? '') && !changed) {
      setChanged(true); //record the difference in state for external use
      setEverChanged(true); //record the field ever being changed for validation purposes
      overrideShowError && setOverrideShowError(false); //remove manual validation override, if it was on
    } else if (changed && value === (initialValue ?? '')) {
      //else, if a change was previously recorded but the state returned to its original value
      setChanged(false); //toggle off that flag
      //NOTE: the "changed" value is useful for quickly determining if a form value is worth saving/sending to backend
    }
    //if the field has any validation and that condition has been met, record a valid validation error on state
    if (validation && runValidation && !!validation(debouncedValue)?.length) {
      setError(validation(debouncedValue));
    } else if (required && runValidation && debouncedValue.length < 1) {
      //else if there was no validation error, but a required field is empty, record that error
      setError(requiredText || 'Required');
    } else if (
      //a required input now has text (and validation condition is met)...
      (required && runValidation && !fieldIsEmpty(debouncedValue)) ||
      //or, a field that used to be required was programmatically updated to no longer be required...
      (!required &&
        (error === 'Required' || (requiredText && error === requiredText))) ||
      //or the validation no longer return an error message...
      (validation && runValidation && !validation(debouncedValue)?.length) ||
      //or the validation condition is no longer active but there's an error on state...
      (validation && !runValidation && !!error?.length)
    ) {
      setError(null); //clear the error
      overrideShowError && setOverrideShowError(false); //and remove manual validation override, if it was on
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
