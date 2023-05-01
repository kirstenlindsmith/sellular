export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

export const setArrayItem = (key, value) => {
  setItem(key, JSON.stringify(value));
};

export const getItem = (key) => {
  return localStorage.getItem(key) || '';
};

export const getArrayItem = (key) => JSON.parse(getItem(key) || '[]');

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
