export const setItemAttributes = (newItem) => (item) =>
  item.id === newItem.id
    ? {
        ...item,
        ...newItem,
      }
    : item;

export const filterOutTarget = (targetId) => (item) => item.id !== targetId;
