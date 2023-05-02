export const formatTimestamp = (inputDate) => {
  const date = new Date(inputDate ?? new Date());
  const month = (date?.getMonth() ?? 0) + 1;
  const day = date?.getDate() ?? 1;
  const year = date?.getFullYear() || '';
  const rawHours = date?.getHours() || 0;
  const isPM = rawHours > 11;
  const hours = isPM ? rawHours - 12 : rawHours;
  let minutes = date?.getMinutes() || '00';
  if (typeof minutes === 'number' && minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${month}/${day}/${year}, ${hours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
};

export const formatStringToDollars = (dollarAmount) => {
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

export const formatNumberToToDecimalString = (number) => {
  if (typeof number !== 'number' || isNaN(number) || number < 0) {
    return '0.00';
  }
  return number.toFixed(2);
};

export const formatStringToDecimalNumber = (string) => {
  if (typeof string !== 'string' || !string) {
    return 0.0;
  }
  return Math.round(parseFloat(string) * 1e2) / 1e2;
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

export const validateDollarField = (value) => {
  if (!value) return;
  const dollarRegex = /^(?:0|[1-9]\d+|)?(?:\.?\d{0,2})?$/;
  if (!dollarRegex.test(value)) {
    return 'Invalid price';
  } else if (formatStringToDecimalNumber(value) > 1000000000) {
    return `Price too high`;
  }
};

export const normalizeName = (value) => {
  if (!value) return;
  const badCharacterRegex = /[^-a-z\s]+/gim;
  return value.replace(badCharacterRegex, '');
};

export const possessiveName = (rawName = '') => {
  if (rawName) {
    return rawName.charAt(rawName.length - 1).toLowerCase() === 's'
      ? rawName + `'`
      : rawName + `'s`;
  } else return 'User';
};

export const makeLinkFromName = (userName = '') =>
  userName.split(' ').join(',');

export const makeNameFromLink = (formattedName = '') =>
  formattedName.split(',').join(' ');
