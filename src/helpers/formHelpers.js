export const formatTimestamp = (inputDate) => {
  const date = new Date(inputDate ?? new Date());
  const month = (date?.getMonth() ?? 0) + 1;
  const day = date?.getDate() ?? 1;
  const year = date?.getFullYear() || '';
  const rawHours = date?.getHours() || 0;
  const isPM = rawHours > 11;
  const hours = isPM ? rawHours - 12 : rawHours;
  const minutes = date?.getMinutes() || '00';
  return `${month}/${day}/${year}, ${hours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
};

export const formatDollars = (dollarAmount) => {
  if (
    typeof dollarAmount !== 'number' ||
    isNaN(dollarAmount) ||
    dollarAmount < 0
  ) {
    return 0;
  }
  const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return dollarFormatter.format(dollarAmount);
};

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
