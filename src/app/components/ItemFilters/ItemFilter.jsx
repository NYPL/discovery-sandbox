import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Icon } from '@nypl/design-system-react-components';

import { getLabelsForValues, isOptionSelected } from './itemFilterUtils';

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
  field,
  options,
  manageFilterDisplay,
  mobile,
  selectedFields,
  submitFilterSelections,
  setSelectedFields,
  isOpen,
  initialFilters = initialFiltersObj,
  fieldToOptionsMap
}) => {
  const [selectionMade, setSelectionMade] = useState(false);
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  if (!options || !options.length || !field) return null;
  /**
   * When a filter is selected, let the parent know through
   * the `setSelectedFields` function.
   */
  const selectFilter = (option) => {
    setSelectedFields((prevSelectedFields) => {
      const updatedSelectedFields = { ...prevSelectedFields };
      const prevSelection = prevSelectedFields[field];
      if (!prevSelection || !prevSelection.length) updatedSelectedFields[field] = [option.value];
      else {
        updatedSelectedFields[field] = Array.isArray(prevSelection) ?
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
      const previousSelection = updatedSelectedFields[field];
      updatedSelectedFields[field] = Array.isArray(previousSelection) ?
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
    const currentSelection = selectedFields[field];
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
    setSelectionMade(true);
    setSelectedFields(prevSelectedFields => ({
      ...prevSelectedFields,
      [field]: [],
    }));
    const clearAll = false
    const clearYear = false
    submitFilterSelections && submitFilterSelections(clearAll, clearYear, field);
  };

  const isSelected = (option) => {
    return isOptionSelected(selectedFields[field], option.value);
  }
  const updatedOptions = updateOptions(options);
  const determineNumOfSelections = () => {
    const thisFilterSelections = initialFilters[field];
    let numSelection
    if (thisFilterSelections) {
      const labels = getLabelsForValues(thisFilterSelections, field, fieldToOptionsMap)
      numSelection = labels.length
    }

    return numSelection ? ` (${numSelection})` : null;
  };
  const numOfSelections = determineNumOfSelections();
  const clickHandler = () => (
    mobile ? setMobileIsOpen(prevState => !prevState) : manageFilterDisplay(field)
  );
  const open = mobile ? mobileIsOpen : isOpen;

  return (
    <div className="item-filter">
      <Button
        buttonType="secondary"
        className={`item-filter-button ${open ? ' open' : ''}`}
        id="item-filter-button"
        onClick={clickHandler}
        type="button"
      >
        {field}{numOfSelections}
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
                    isDisabled={!selectedFields[field].length}
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
    </div>
  );
};

ItemFilter.propTypes = {
  field: PropTypes.string,
  fieldToOptionsMap: PropTypes.object,
  initialFilters: PropTypes.object,
  isOpen: PropTypes.bool,
  manageFilterDisplay: PropTypes.func,
  mobile: PropTypes.bool,
  options: PropTypes.array,
  selectedFields: PropTypes.object,
  setSelectedFields: PropTypes.func,
  submitFilterSelections: PropTypes.func,
};

ItemFilter.defaultProps = {
  isOpen: false,
  mobile: false,
  selectedFields: {
    location: [],
    format: [],
    status: [],
    year: []
  },
};

ItemFilter.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilter;
