/*
 * chunk(arr, n)
 * @description Break up all the items in the array into array of size n arrays.
 * @param {array} arr The array of items.
 * @param {n} number The number we want to break the array into.
 */
function chunk (arr, n) {
  if (Array.isArray(arr) && !arr.length) {
    return [];
  }
  return [arr.slice(0, n)].concat(chunk(arr.slice(n), n));
}

function filterItems (items, query, hasFilter) {
  if (!items || !items.length) return [];
  if (!query) return items;
  if (!hasFilter) return items;

  return items.filter((item) => {
    const showItem = itemFilters.every((filter) => {
      const filterType = filter.type;
      const filterValue = query[filterType];
      if (!filterValue) return true;
      const selections =
        typeof filterValue === 'string' ? [filterValue] : filterValue;
      return selections.some((selection) => {
        const isRequestable =
          filterType === 'status' && selection === 'requestable';
        if (isRequestable) return item.requestable;
        const isOffsite =
          filterType === 'location' && selection === 'offsite';
        if (isOffsite) return item.isOffsite;
        const itemProperty = filter.retrieveOption(item).label;
        return isOptionSelected(selection, itemProperty, true);
      });
    });
    return showItem;
  });
}

export { chunk, filterItems }