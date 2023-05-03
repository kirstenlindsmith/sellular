import { useCallback } from 'react';
import './Input.css';

const Input = ({
  name,
  label,
  fieldHandler,
  fullWidth,
  multiline,
  onBlur,
  onChange,
  onFocus,
  error,
  startIcon,
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

  const InputComponent = useCallback(
    (props) => (multiline ? <textarea {...props} /> : <input {...props} />),
    [multiline]
  );

  return (
    <div
      className={`input-section ${fullWidth ? 'full-width' : ''}${
        error || fieldHandler?.error ? 'field-error' : ''
      }`}
    >
      <div className='icon-and-input'>
        <span className='start-icon'>{startIcon ?? null}</span>
        <div className={`input-and-label ${fullWidth ? 'full-width' : ''}`}>
          <InputComponent
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
