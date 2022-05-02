import {
  mapObject as _mapObject,
  findWhere as _findWhere,
  forEach as _forEach,
  isEmpty as _isEmpty,
  isArray as _isArray,
} from 'underscore';

const createSelectedFiltersHash = (filters, apiFilters) => {
  const selectedFilters = {
    materialType: [],
    language: [],
    dateAfter: '',
    dateBefore: '',
    subjectLiteral: [],
  };
  if (!_isEmpty(filters)) {
    _mapObject(filters, (value, key) => {
      let filterObj;
      if (key === 'dateAfter' || key === 'dateBefore') {
        selectedFilters[key] = value;
      } else if (key === 'subjectLiteral') {
        const subjectLiteralValues = _isArray(value) ? value : [value];
        subjectLiteralValues.forEach((subjectLiteralValue) => {
          selectedFilters[key].push({
            selected: true,
            value: subjectLiteralValue,
            label: subjectLiteralValue,
          });
        });
      } else if (_isArray(value) && value.length) {
        if (!selectedFilters[key]) {
          selectedFilters[key] = [];
        }
        _forEach(value, (filterValue) => {
          filterObj = _findWhere(apiFilters.itemListElement, { field: key });
          const foundFilter = _isEmpty(filterObj)
            ? {}
            : _findWhere(filterObj.values, { value: filterValue });

          if (
            foundFilter &&
            !_findWhere(selectedFilters[key], { id: foundFilter.value })
          ) {
            selectedFilters[key].push({
              selected: true,
              value: foundFilter.value,
              label: foundFilter.label || foundFilter.value,
              count: foundFilter.count,
            });
          }
        });
      } else if (typeof value === 'string') {
        filterObj = _findWhere(apiFilters.itemListElement, { field: key });
        const foundFilter = _isEmpty(filterObj)
          ? {}
          : _findWhere(filterObj.values, { value });

        if (
          foundFilter &&
          !_findWhere(selectedFilters[key], { id: foundFilter.value })
        ) {
          selectedFilters[key] = [
            {
              selected: true,
              value: foundFilter.value,
              label: foundFilter.label || foundFilter.value,
              count: foundFilter.count,
            },
          ];
        }
      }
    });
  }
  return selectedFilters;
};

export default createSelectedFiltersHash;
