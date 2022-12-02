import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon } from '@nypl/design-system-react-components';
import FocusTrap from 'focus-trap-react';

import { isOptionSelected } from '../../utils/utils';

const updateOptions = options =>
  options.map(option => ({
    id: option.label,
    label: option.label,
  }));

const ItemFilter = ({
  filter,
  options,
  manageFilterDisplay,
  mobile,
  selectedFilters,
  submitFilterSelections,
  setSelectedFilters,
  isOpen,
  initialFilters,
}) => {
  const [selectionMade, setSelectionMade] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);

  if (!options || !filter) return null;

  const selectFilter = (value) => {
    setSelectedFilters((prevSelectedFilters) => {
      const updatedSelectedFilters = { ...prevSelectedFilters };
      const prevSelection = prevSelectedFilters[filter];
      if (!prevSelection || !prevSelection.length) updatedSelectedFilters[filter] = [value.id];
      else {
        updatedSelectedFilters[filter] = Array.isArray(prevSelection) ?
          [...prevSelection, value.id] : [prevSelection, value.id];
      }

      return updatedSelectedFilters;
    });
  };

  const deselectFilter = (value) => {
    setSelectedFilters((prevSelectedFilters) => {
      const updatedSelectedFilters = { ...prevSelectedFilters };
      const previousSelection = updatedSelectedFilters[filter];
      updatedSelectedFilters[filter] = Array.isArray(previousSelection) ?
        previousSelection.filter(prevSelection => prevSelection !== value.id)
        : [];
      return updatedSelectedFilters;
    });
  };

  const handleCheckbox = (option) => {
    if (!selectionMade) setSelectionMade(true);
    const currentSelection = selectedFilters[filter];
    if (currentSelection && currentSelection.includes(option.id)) {
      deselectFilter(option);
    } else {
      selectFilter(option);
    }
  };

  const isSelected = (option) =>
    isOptionSelected(selectedFilters[filter], option.id);

  const updatedOptions = updateOptions(options);
  const determineNumOfSelections = () => {
    const thisFilterSelections = initialFilters[filter];
    const numSelection = thisFilterSelections.length === 0 ? '' :
      typeof thisFilterSelections === 'string' ? 1 : thisFilterSelections.length;

    return numSelection ? ` (${numSelection})` : null;
  };
  const numOfSelections = determineNumOfSelections();

  const clickHandler = () => (
    mobile ? setMobileIsOpen(prevState => !prevState) : manageFilterDisplay(filter)
  );
  const open = mobile ? mobileIsOpen : isOpen;
  const clear = () => {
    setSelectionMade(true);
    setSelectedFilters(prevSelectedFilters => ({
      ...prevSelectedFilters,
      [filter]: [],
    }));
  };

  return (
    <FocusTrap
      focusTrapOptions={{
        clickOutsideDeactivates: true,
        onDeactivate: () => {
          if (!mobile) manageFilterDisplay('none');
        },
        returnFocusOnDeactivate: false,
      }}
      active={isOpen}
      className="item-filter"
    >
      <Button
        buttonType="secondary"
        className={`item-filter-button ${open ? ' open' : ''}`}
        id="item-filter-button"
        onClick={clickHandler}
        type="button"
      >
        {filter}{numOfSelections}
        <Icon name={open ? 'minus' : 'plus'} size='medium' />
      </Button>
      {open ? (
        <div className="item-filter-content">
          <fieldset>
            {updatedOptions.map((option, key) => (
              <Checkbox
                id={option.id}
                labelText={option.label}
                onChange={() => handleCheckbox(option)}
                key={key}
                isChecked={isSelected(option)}
                __css={{
                  span: {
                    fontSize: '15px',
                    fontWeight: 'medium',
                  }
                }}
              />
            ))}
          </fieldset>
          {
            !mobile ?
            (
              <div className="item-filter-buttons">
                <Button
                  buttonType="link"
                  onClick={() => clear()}
                  isDisabled={!selectedFilters[filter].length}
                  id="clear-filter-button"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => submitFilterSelections()}
                  isDisabled={!selectionMade}
                  id="apply-filter-button"
                >
                  Apply
                </Button>
              </div>
            ) : null
          }
        </div>
      ) : null}
    </FocusTrap>
  );
};

ItemFilter.propTypes = {
  filter: PropTypes.string,
  options: PropTypes.array,
  isOpen: PropTypes.bool,
  manageFilterDisplay: PropTypes.func,
  mobile: PropTypes.bool,
  selectedFilters: PropTypes.object,
  submitFilterSelections: PropTypes.func,
  setSelectedFilters: PropTypes.func,
  initialFilters: PropTypes.object,
};

ItemFilter.defaultProps = {
  isOpen: false,
  mobile: false,
  selectedFilters: {
    location: [],
    format: [],
    status: [],
  },
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
