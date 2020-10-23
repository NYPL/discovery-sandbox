import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, Icon } from '@nypl/design-system-react-components';
import ItemFilter from './ItemFilter';

import { trackDiscovery } from '../../utils/utils';
import { itemFilters } from '../../data/constants';


const ItemFiltersMobile = ({
  options,
  openFilter,
  manageFilterDisplay,
  selectedFilters,
  updateSelectedFilters,
}, context) => {
  const [displayFilters, toggleFilterDisplay] = useState(false);
  const initialFilters = location.query ? location.query : {};

  if (!displayFilters) return (
    <Button
      onClick={() => toggleFilterDisplay(true)}
      buttonType="outline"
    >Filters</Button>
  )

  return (
    <Modal
      onClick={() => toggleFilters(true)}
      buttonType="outline"
      className="scc-item-filters nypl-ds"
    >
      <Button
        buttonType="link"
        onClick={() => toggleFilterDisplay(false)}
        className="go-back-button"
      >
        <Icon name="arrow" iconRotation="rotate-90" />Go back
      </Button>
      <Button
        className="show-results-button"
        onClick={() => submitFilterSelections(selectedFilters)}
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
              open={openFilter === filter.type}
              manageFilterDisplay={manageFilterDisplay}
              key={filter.type}
              mobile
              selectedFilters={selectedFilters}
              updateSelectedFilters={updateSelectedFilters}
            />
          ))
        }
      </div>
    </Modal>
  );
};

ItemFiltersMobile.propTypes = {
  items: PropTypes.array,
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.number,
};

ItemFiltersMobile.contextTypes = {
  router: PropTypes.object,
};

export default ItemFiltersMobile;
