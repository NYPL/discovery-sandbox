import { ModalTrigger } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';

import ItemFilter from './ItemFilter';

/**
 * This renders the button that acts as a Modal Trigger. Clicking the button
 * opens a Modal from the new Reservoir Design System, which contains the 
 * items filters.
 */
const ItemFiltersMobile = ({
  itemsAggregations,
  manageFilterDisplay,
  selectedFilters,
  setSelectedFilters,
  submitFilterSelections,
  initialFilters,
}) => {
  if (!itemsAggregations) return null;
  const showResultsAction = () => {
    submitFilterSelections();
  };

  const modalProps = {
    bodyContent: (
      <div className="scc-item-filters" id="item-filters-mobile">
        <div id="item-filters" className="item-table-filters">
          {
            itemsAggregations.map(filter => (
              <ItemFilter
                filter={filter.field}
                key={filter.id}
                options={filter.values}
                mobile
                manageFilterDisplay={manageFilterDisplay}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                submitFilterSelections={submitFilterSelections}
                initialFilters={initialFilters}
              />
            ))
          }
        </div>
      </div>
    ),
    headingText: "Filters",
    closeButtonLabel: "Show Results",
    onClose: () => {
      showResultsAction()
    }
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
  itemsAggregations: PropTypes.object,
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

