import { isOptionSelected } from './utils';

function filterItems (items, query, hasFilter, itemFilters) {
  if (!items || !items.length) return [];
  if (!query) return items;
  if (!hasFilter) return items;

  return items.filter((item) => {
    const showItem = itemFilters && itemFilters.every((filter) => {
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

export { filterItems }