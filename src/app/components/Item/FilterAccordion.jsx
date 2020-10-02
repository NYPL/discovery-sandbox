import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Checkbox } from '@nypl/design-system-react-components';

import { isOptionSelected } from '../../utils/utils';

const FilterAccordion = ({ filterOptions, filterLabel }, context) => {
  const distinctOptions = Array.from(new Set(
    // eslint-disable-next-line comma-dangle
    filterOptions.map(option => option.id))
  ).map(id => ({
    id,
    label: filterOptions.find(option => option.id === id).label,
  }));

  const applyFilter = (option) => {
    const { push, location, createHref } = context.router;
    const newQuery = {};
    const param = filterLabel.toLowerCase();
    newQuery[param] = [option.id];
    if (location.query[param]) {
      newQuery[param].push(location.query[param]);
    }
    const href = createHref({ ...location, ...{ query: newQuery, hash: '#item-filters', search: '' } });

    push(href);
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
                onChange={() => applyFilter(option)}
                key={option.id || i}
                isSelected={isSelected(option)}
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

FilterAccordion.contextTypes = {
  router: PropTypes.object,
};

export default FilterAccordion;
