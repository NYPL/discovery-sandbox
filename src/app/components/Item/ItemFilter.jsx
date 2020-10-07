import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon } from '@nypl/design-system-react-components';
import FocusTrap from 'focus-trap-react';

import { isOptionSelected } from '../../utils/utils';

// export for testing purposes
export const parseDistinctOptions = options => Array.from(
  new Set(options.reduce((optionIds, option) => {
    if (option.id && option.id.length) optionIds.push(option.id);
    return optionIds;
  }, [])))
  .map(id => ({
    id,
    label: options.find(option => (option.id === id && option.label.length)).label,
  }));

const ItemFilter = ({ filter, options, open, manageFilterDisplay }, context) => {
  const { router } = context;
  const { location, createHref } = router;
  const initialFilters = location.query || {};
  const [selectionMade, setSelectionMade] = useState(false);
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
      previousSelection.filter(prevSelection => prevSelection !== value.id)
      : [];
    updateSelectedFilters(updatedSelectedFilters);
  };

  const handleCheckbox = (option) => {
    if (!selectionMade) setSelectionMade(true);
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

  const distinctOptions = parseDistinctOptions(options);
  const thisFilterSelections = initialFilters[filter];
  const numOfSelections = () => (typeof thisFilterSelections === 'string' ? 1 : thisFilterSelections.length);

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
          {filter} {thisFilterSelections ? `(${numOfSelections()})` : null} <Icon name={open ? 'minus' : 'plus'} />
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
              <Button
                buttonType="link"
                onClick={() => manageFilterDisplay('none')}
              >Clear
              </Button>
              <Button
                onClick={submitFilterSelections}
                disabled={!selectionMade}
              >Apply</Button>
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
