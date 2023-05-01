export const makeGroupsOfThree = (allItems) => {
  if (!allItems) return [];
  const roundedItems = [...allItems];
  //if the total items count isn't evenly divisible by 3...
  while (roundedItems.length % 3 !== 0) {
    //..fill empty row slots with placeholders, to make sure spacing for rows stays consistent despite flex grow styling
    roundedItems.push('placeholder');
  }
  const result = [];
  roundedItems.forEach((item, index) => {
    //prepare a row for every group of 3 items
    if (index % 3 === 0) {
      result.push([]);
    }
    //directly access each row to establish its members, for time efficiency
    result[result.length - 1].push(item);
  });
  return result;
};
