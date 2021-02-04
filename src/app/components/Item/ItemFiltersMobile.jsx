import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, Icon } from '@nypl/design-system-react-components';
import ItemFilter from './ItemFilter';

import { itemFilters } from '../../data/constants';


const ItemFiltersMobile = ({
  options,
  openFilter,
  manageFilterDisplay,
  selectedFilters,
  setSelectedFilters,
  submitFilterSelections,
  initialFilters,
}) => {
  const [displayFilters, toggleFilterDisplay] = useState(false);

  if (!displayFilters) {
    return (
      <Button
        onClick={() => toggleFilterDisplay(true)}
        buttonType="outline"
        className="item-table-filters"
      >Filters
      </Button>
    );
  }

  const showResultsAction = () => {
    toggleFilterDisplay(false);
    submitFilterSelections(selectedFilters);
  };

  const goBackAction = () => {
    toggleFilterDisplay(false);
    setSelectedFilters(initialFilters);
  };

  return (
    <Modal
      buttonType="outline"
      className="scc-item-filters nypl-ds"
    >
      <Button
        buttonType="link"
        onClick={goBackAction}
        className="go-back-button"
      >
        <Icon name="arrow" iconRotation="rotate-90" />Go back
      </Button>
      <Button
        className="show-results-button"
        onClick={showResultsAction}
      >
        Show Results
      </Button>
      <h1>Filters</h1>
      <div id="item-filters" className="item-table-filters">
        {
          itemFilters.map(filter => (
            <ItemFilter
              filter={filter.type}
              options={options[filter.type]}
              openFilter={openFilter}
              manageFilterDisplay={manageFilterDisplay}
              key={filter.type}
              mobile
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              submitFilterSelections={submitFilterSelections}
            />
          ))
        }
      </div>
    </Modal>
  );
};

ItemFiltersMobile.propTypes = {
  options: PropTypes.object,
  openFilter: PropTypes.string,
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
