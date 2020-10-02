import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox, Button } from '@nypl/design-system-react-components';

import { isOptionSelected } from '../../utils/utils';

const FilterAccordion = ({ filterOptions, filterLabel }, context) => {
  const { router } = context;
  const { location, createHref } = router;
  const initialFilters = location.query || {};
  const [selectedFilters, updateSelectedFilters] = useState(initialFilters);
  const distinctOptions = Array.from(new Set(
    // eslint-disable-next-line comma-dangle
    filterOptions.map(option => option.id))
  ).map(id => ({
    id,
    label: filterOptions.find(option => option.id === id).label,
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

  const submitFilterSelections = (option) => {
    const newQuery = {};
    const param = filterLabel.toLowerCase();
    newQuery[param] = [option.id];
    if (location.query[param]) {
      newQuery[param].push(location.query[param]);
    }
    const href = createHref({ ...location, ...{ query: selectedFilters, hash: '#item-filters', search: '' } });

    router.push(href);
  };

  const isSelected = (option) => {
    const { query } = context.router.location;
    if (!query) return false;
    const result = isOptionSelected(query[filterLabel.toLowerCase()], option.id);

    return result;
  };

  return (
    <span className="scc-filter-accordion-wrapper">
      <Accordion
        accordionLabel={filterLabel}
        className="scc-filter-accordion"
      >
        <ul>
          {distinctOptions.map((option, i) => (
            <li>
              <Checkbox
                labelOptions={{
                  id: option.id,
                  labelContent: option.label,
                }}
                onChange={() => selectFilter(filterLabel, option.id)}
                key={option.id || i}
                isSelected={isSelected(option)}
              />
            </li>
          ))}
        </ul>
        <Button buttonType="link">Clear</Button>
        <Button onClick={submitFilterSelections}>Save</Button>
      </Accordion>
    </span>
  );
};

FilterAccordion.propTypes = {
  filterOptions: PropTypes.array,
  filterLabel: PropTypes.string,
};

FilterAccordion.contextTypes = {
  router: PropTypes.object,
};

export default FilterAccordion;
