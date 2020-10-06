import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon } from '@nypl/design-system-react-components';
import FocusTrap from 'focus-trap-react';

import { isOptionSelected } from '../../utils/utils';

const ItemFilter = ({ filter, options, open, manageFilterDisplay }, context) => {
  const { router } = context;
  const { location, createHref } = router;
  const initialFilters = location.query || {};
  const [selectedFilters, updateSelectedFilters] = useState(initialFilters);

  const selectFilter = (value) => {
    const updatedSelectedFilters = selectedFilters;
    const prevSelection = selectedFilters[filter];
    if (!prevSelection || !prevSelection.length) updatedSelectedFilters[filter] = [value.id];
    else {
      updatedSelectedFilters[filter] = Array.isArray(prevSelection) ?
        [...prevSelection, value.id] : [prevSelection, value.id];
    }
    updateSelectedFilters(updatedSelectedFilters);
  };

  const deselectFilter = (value) => {
    const updatedSelectedFilters = selectedFilters;
    const previousSelection = selectedFilters[filter];
    updatedSelectedFilters[filter] = Array.isArray(previousSelection) ?
      previousSelection.filter(prevSelection => prevSelection.id !== value.id)
      : [];
    updateSelectedFilters(updatedSelectedFilters);
  };

  const handleCheckbox = (option) => {
    const currentSelection = selectedFilters[filter];
    if (currentSelection && currentSelection.includes(option.id)) {
      deselectFilter(option);
    } else selectFilter(option);
  };

  const submitFilterSelections = () => {
    const href = createHref({
      ...location,
      ...{
        query: selectedFilters,
        hash: '#item-filters',
        search: '',
      },
    });
    manageFilterDisplay('none');

    router.push(href);
  };

  const isSelected = (option) => {
    const { query } = location;
    if (!query) return false;
    const result = isOptionSelected(query[filter], option.id);

    return result;
  };

  const distinctOptions = Array.from(new Set(options.reduce((optionIds, option) => {
    if (option.id) optionIds.push(option.id);
    return optionIds;
  }, [])))
    .map(id => ({
      id,
      label: options.find(option => option.id === id).label,
    }));

  return (
    <div
      className="item-filter"
    >
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          onDeactivate: () => manageFilterDisplay('none'),
        }}
        active={open}
      >
        <Button
          className="item-filter-button"
          buttonType="outline"
          onClick={() => manageFilterDisplay(filter)}
          type="button"
        >
          {filter} <Icon name={open ? 'minus' : 'plus'} />
        </Button>
        {open ? (
          <div
            className="item-filter-content"
          >
            <ul>
              {distinctOptions.map((option, i) => (
                <li key={option.id || i}>
                  <Checkbox
                    labelOptions={{
                      id: option.id,
                      labelContent: option.label,
                    }}
                    onChange={() => handleCheckbox(option)}
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
      </FocusTrap>
    </div>
  );
};

ItemFilter.propTypes = {
  filter: PropTypes.string,
  options: PropTypes.array,
  open: PropTypes.bool,
  manageFilterDisplay: PropTypes.func,
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
