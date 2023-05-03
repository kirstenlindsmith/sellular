//NOTE: not a "type" but since this is reused and serves a similar purpose I felt like putting it here
export const defaultTextInputState = {
  value: '',
  debouncedValue: '',
  setValue: () => undefined,
  reset: () => undefined,
  interact: false,
  setInteract: () => undefined,
  changed: false,
  touched: false,
  setTouched: () => undefined,
  blurred: false,
  setBlurred: () => undefined,
  error: undefined,
  setError: () => undefined,
  forceError: () => undefined,
  valid: false,
};
