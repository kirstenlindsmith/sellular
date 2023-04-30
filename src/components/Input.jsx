import { useCallback } from 'react';

const Input = ({
  name,
  label,
  fieldHandler,
  onBlur,
  onChange,
  onFocus,
  error,
  ...rest
}) => {
  const handleFocus = useCallback(() => {
    fieldHandler?.setTouched?.(true);
    fieldHandler?.setBlurred?.(false);
    onFocus?.();
  }, [fieldHandler, onFocus]);

  const handleBlur = useCallback(() => {
    fieldHandler?.setBlurred?.(true);
    onBlur?.();
  }, [fieldHandler, onBlur]);

  const handleChange = useCallback(
    (e) => {
      fieldHandler?.setValue?.(e?.target.value ?? '');
      onChange?.(e);
    },
    [fieldHandler, onChange]
  );

  return (
    <div
      className={`input-section ${
        error || fieldHandler?.error ? 'field-error' : ''
      }`}
    >
      <div className='input-and-label'>
        <input
          name={name}
          value={fieldHandler.value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-describedby={`${name}-helper-text`}
          {...rest}
        />
        {!!label && <label htmlFor={name}>{label}</label>}
      </div>
      {!!fieldHandler?.error && (
        <span className='helper-text' role='alert' id={`${name}-helper-text`}>
          {fieldHandler?.error || ''}
        </span>
      )}
    </div>
  );
};

export default Input;
