import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon } from '@nypl/design-system-react-components';

import { isOptionSelected } from '../../utils/utils';

const ItemFilter = ({ filter, options, open, changeOpenFilter }, context) => {
  const { router } = context;
  const { location, createHref } = router;
  const initialFilters = location.query || {};
  const [selectedFilters, updateSelectedFilters] = useState(initialFilters);

  const distinctOptions = Array.from(new Set(options.reduce((optionIds, option) => {
    if (option.id) optionIds.push(option.id)
    return optionIds
  }, [])))
  .map(id => ({
    id,
    label: options.find(option => option.id === id).label,
  }));

  const selectFilter = (filter, value) => {
    const updatedSelectedFilters = selectedFilters;
    const previousSelection = selectedFilters[filter];
    if (!previousSelection) updatedSelectedFilters[filter] = [value];
    else {
      updatedSelectedFilters[filter] = previousSelection.push ?
        previousSelection.push(value) : [previousSelection, value];
    }
    updateSelectedFilters(updatedSelectedFilters);
  };

  const submitFilterSelections = () => {
    const newQuery = {};
    const param = filterLabel.toLowerCase();
    if (location.query[param]) {
      newQuery[param].push(location.query[param]);
    }
    const href = createHref({ ...location, ...{ query: selectedFilters, hash: '#item-filters', search: '' } });

    router.push(href);
  };

  const isSelected = (option) => {
    const { query } = context.router.location;
    if (!query) return false;
    const result = isOptionSelected(query[filter], option.id);

    return result;
  };

  return (
    <div
      className="item-filter"
    >
      <Button
        className="item-filter-button"
        buttonType="outline"
        onClick={() => changeOpenFilter(filter)}
        type="button"
      >
        {filter} <Icon name={open ? 'minus' : 'plus'} />
      </Button>
      {open ? (
        <div className="item-filter-content">
          <ul>
            {distinctOptions.map((option, i) => (
              <li key={option.id || i}>
                <Checkbox
                  labelOptions={{
                    id: option.id,
                    labelContent: option.label,
                  }}
                  onChange={() => changeOpenFilter(filterLabel, option.id)}
                  key={option.id || i}
                  isSelected={isSelected(option)}
                />
              </li>
            ))}
          </ul>
          <div className="item-filter-buttons">
            <Button buttonType="link">Clear</Button>
            <Button onClick={submitFilterSelections}>Save</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

ItemFilter.propTypes = {
  filter: PropTypes.string,
  options: PropTypes.array,
  open: PropTypes.bool,
  changeOpenFilter: PropTypes.func,
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
