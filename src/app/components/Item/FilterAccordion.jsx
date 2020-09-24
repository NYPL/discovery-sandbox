import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox } from '@nypl/design-system-react-components';

const FilterAccordion = ({ filterOptions, filterLabel }) => {
  const distinctOptions = Array.from(new Set(
    // eslint-disable-next-line comma-dangle
    filterOptions.map(option => option.id))
  ).map(id => ({
    id,
    label: filterOptions.find(option => option.id === id).label,
  }));
  return (
    <span className="scc-filter-accordion-wrapper">
      <Accordion
        accordionLabel={filterLabel}
        className="scc-filter-accordion"
      >
        <ul>
          {distinctOptions.map(option => (
            <li>
              <Checkbox
                labelOptions={{
                  id: option.id,
                  labelContent: option.label,
                }}
                onChange={() => {}}
              />
            </li>
          ))}
        </ul>
      </Accordion>
    </span>
  );
};

FilterAccordion.propTypes = {
  filterOptions: PropTypes.array,
  filterLabel: PropTypes.string,
};

export default FilterAccordion;
