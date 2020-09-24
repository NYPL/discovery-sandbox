import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox } from '@nypl/design-system-react-components';

const FilterAccordion = ({ filterOptions, filterLabel }) => {
  const distinctOptions = [...new Set(filterOptions)];
  return (
    <span className="scc-filter-accordion-wrapper">
      <Accordion
        accordionLabel={filterLabel}
        className="scc-filter-accordion"
      >
        <ul>
          {distinctOptions.map(location => (
            <li>
              <Checkbox
                labelOptions={{
                  id: location,
                  labelContent: location,
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
