import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, ModalTrigger } from '@nypl/design-system-react-components';

import ItemFilter from './ItemFilter';
import { itemFilters } from '../../data/constants';

/**
 * This renders a modal interface based on an early version from the
 * Reservoir Design System through the `old-ds-modal` CSS class.
 */


const ItemFiltersMobile = ({
  options,
  manageFilterDisplay,
  selectedFilters,
  setSelectedFilters,
  submitFilterSelections,
  initialFilters,
}) => {
  if (!options) return null;
  const showResultsAction = () => {
    submitFilterSelections(selectedFilters);
  };

  const goBackAction = () => {
    setSelectedFilters(initialFilters);
  };

  const modalProps = {
    bodyContent: (
      <div
        className="scc-item-filters old-ds-modal"
        id="item-filters-mobile"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex="0"
      >
        <h1>Filters</h1>
        <div id="item-filters" className="item-table-filters">
          {
            itemFilters.map(filter => (
              <ItemFilter
                filter={filter.type}
                options={options[filter.type]}
                manageFilterDisplay={manageFilterDisplay}
                key={filter.type}
                mobile
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                submitFilterSelections={submitFilterSelections}
                initialFilters={initialFilters}
              />
            ))
          }
        </div>
        <Button
          className="show-results-button"
          onClick={showResultsAction}
          id="show-results-button"
        >
          Show Results
        </Button>
      </div>
    ),
    headingText: "Filters"
  }
  return (
    <ModalTrigger
      buttonType="secondary"
      className="item-table-filters"
      id="filters-button"
      buttonText="Filters"
      modalProps={modalProps} />
  );
};

ItemFiltersMobile.propTypes = {
  options: PropTypes.object,
  manageFilterDisplay: PropTypes.func,
  selectedFilters: PropTypes.object,
  setSelectedFilters: PropTypes.func,
  submitFilterSelections: PropTypes.func,
  initialFilters: PropTypes.object,
};

ItemFiltersMobile.contextTypes = {
  router: PropTypes.object,
};

export default ItemFiltersMobile;
