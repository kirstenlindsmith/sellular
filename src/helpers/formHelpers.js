export const validateStringLength =
  (maxLength = 100, minLength = 0, requiredText = 'Required') =>
  (value) => {
    if (!value && !minLength) return;
    let error;
    if (value.length > maxLength) {
      error = `${value.length}/${maxLength} characters`;
    } else if (!!minLength && value.length === 0) {
      return requiredText || 'Required';
    } else if (!!minLength && value.length === 0) {
      return;
    } else if (minLength !== undefined && value.length < (minLength ?? 1)) {
      error = `Minimum ${minLength} characters`;
    }
    return error;
  };
