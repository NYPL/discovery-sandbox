import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Icon } from '@nypl/design-system-react-components';
import FocusTrap from 'focus-trap-react';

import { isOptionSelected } from '../../utils/utils';

export const parseDistinctOptions = options =>
  Array.from(
    new Set(options.reduce((optionLabels, option) => {
      if (Array.isArray(option.label)) return optionLabels.concat(option.label);
      return optionLabels.concat([option.label]);
    }, [])),
  )
    .map(label => ({
      id: label,
      label,
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
}, { router }) => {
  const { location } = router;
  const { query } = location;
  const [selectionMade, setSelectionMade] = useState(false);

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
    } else selectFilter(option);
  };

  const isSelected = (option) => {
    if (!query) return false;
    const result = isOptionSelected(selectedFilters[filter], option.id);

    return result;
  };

  const distinctOptions = parseDistinctOptions(options);
  const initialFilters = location.query ? location.query : {};
  const thisFilterSelections = initialFilters[filter];
  const determineNumOfSelections = () => {
    if (!thisFilterSelections) return null;
    return typeof thisFilterSelections === 'string' ? 1 : thisFilterSelections.length;
  };
  const numOfSelections = determineNumOfSelections();

  const [mobileIsOpen, manageMobileFilter] = useState(false);

  const clickHandler = () => (
    mobile ? manageMobileFilter(prevState => !prevState) : manageFilterDisplay(filter)
  );
  const open = mobile ? mobileIsOpen : isOpen;

  return (
    <div
      className="item-filter"
    >
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          onDeactivate: () => { if (!mobile) manageFilterDisplay('none') },
          returnFocusOnDeactivate: false,
        }}
        active={isOpen}
      >
        <Button
          className={`item-filter-button ${
            open ? ' open' : ''}`}
          buttonType="outline"
          onClick={clickHandler}
          type="button"
        >
          {filter}{numOfSelections ? ` (${numOfSelections})` : null} <Icon name={open ? 'minus' : 'plus'} />
        </Button>
        {open ? (
          <div
            className="item-filter-content"
          >
            <fieldset>
              {distinctOptions.map((option, i) => (
                <Checkbox
                  labelOptions={{
                    id: option.id,
                    labelContent: option.label,
                  }}
                  onChange={() => handleCheckbox(option)}
                  key={option.id || i}
                  checkboxId={option.id}
                  checked={isSelected(option)}
                />
              ))}
            </fieldset>
            {
              !mobile ?
              (
                <div className="item-filter-buttons">
                  <Button
                    buttonType="link"
                    onClick={() => manageFilterDisplay('none')}
                  >Clear
                  </Button>
                  <Button
                    onClick={() => submitFilterSelections(selectedFilters)}
                    disabled={!selectionMade}
                  >Apply
                  </Button>
                </div>
              ) : null
            }
          </div>
        ) : null}
      </FocusTrap>
    </div>
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
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
