import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon } from '@nypl/design-system-react-components';
import FocusTrap from 'focus-trap-react';

import { isOptionSelected } from '../../utils/utils';

/**
 * This is to better structure the data for the checkboxes.
 */
const updateOptions = options =>
  options.map(option => {
    return {
    label: option.label,
      value: option.value
    }
  });
const initialFiltersObj = {
  location: [],
  format: [],
  status: [],
  year: [],
};

/**
 * The individual filter dropdown component.
 */
const ItemFilter = ({
  filter,
  options,
  manageFilterDisplay,
  mobile,
  selectedFields,
  submitFilterSelections,
  setSelectedFields,
  isOpen,
  initialFilters = initialFiltersObj,
  getLabelForValue
}) => {
  const [selectionMade, setSelectionMade] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);

  if (!options || !options.length || !filter) return null;
  /**
   * When a filter is selected, let the parent know through
   * the `setSelectedFields` function.
   */
  const selectFilter = (option) => {
    console.log(selectedFields)
    setSelectedFields((prevSelectedFields) => {
      const updatedSelectedFields = { ...prevSelectedFields };
      const prevSelection = prevSelectedFields[filter];
      if (!prevSelection || !prevSelection.length) updatedSelectedFields[filter] = [option.value];
      else {
        updatedSelectedFields[filter] = Array.isArray(prevSelection) ?
          [...prevSelection, option.value] : [prevSelection, option.value];
      }

      return updatedSelectedFields;
    });
  };

  /**
   * When a filter is deselected, let the parent know through
   * the `setSelectedFields` function.
   */
  const deselectFilter = (option) => {
    setSelectedFields((prevSelectedFields) => {
      const updatedSelectedFields = { ...prevSelectedFields };
      const previousSelection = updatedSelectedFields[filter];
      updatedSelectedFields[filter] = Array.isArray(previousSelection) ?
        previousSelection.filter(prevSelectedOption => prevSelectedOption !== option.value)
        : [];
      return updatedSelectedFields;
    });
  };

  /**
   * When a checkbox is clicked, check if it is selected or not.
   */
  // deletethiscomment handle checkbox works as needed
  const handleCheckbox = (option) => {
    if (!selectionMade) setSelectionMade(true);
    const currentSelection = selectedFields[filter];
    if (currentSelection && currentSelection.includes(option.value)) {
      deselectFilter(option);
    } else {
      selectFilter(option);
    }
  };

  /**
   * Clear all the selections for the filter and submit to
   * get the new results.
   */
  const clear = () => {
    const clear = true;
    setSelectionMade(true);
    setSelectedFields(prevSelectedFields => ({
      ...prevSelectedFields,
      [filter]: [],
    }));
    submitFilterSelections && submitFilterSelections(clear);
  };

  const isSelected = (option) =>
    isOptionSelected(selectedFields[filter], option.value);
  const updatedOptions = updateOptions(options);
  const determineNumOfSelections = () => {
    console.log(initialFilters)
    const thisFilterSelections = initialFilters[filter];
    // get labels from label function, count those!!!
    const numSelection = thisFilterSelections.length === 0 ? '' :
      typeof thisFilterSelections === 'string' ? 1 : thisFilterSelections.length;

    return numSelection ? ` (${numSelection})` : null;
  };
  const numOfSelections = determineNumOfSelections();
  const clickHandler = () => (
    mobile ? setMobileIsOpen(prevState => !prevState) : manageFilterDisplay(filter)
  );
  const open = mobile ? mobileIsOpen : isOpen;

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
                id={option.value}
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
                    isDisabled={!selectedFields[filter].length}
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
  selectedFields: PropTypes.object,
  submitFilterSelections: PropTypes.func,
  setSelectedFields: PropTypes.func,
  initialFilters: PropTypes.object,
};

ItemFilter.defaultProps = {
  isOpen: false,
  mobile: false,
  selectedFields: {
    location: [],
    format: [],
    status: [],
  },
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
