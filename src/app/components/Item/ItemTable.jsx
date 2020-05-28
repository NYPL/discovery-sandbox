import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray } from 'underscore';

import ItemTableRow from './ItemTableRow';

const ItemTable = ({ items, bibId, id, searchKeywords }) => {
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    return null;
  }

  return (
    <table className="nypl-basic-table" id={id}>
      <caption className="hidden">Item details</caption>
      <thead>
        <tr>
          <th scope="col">Location</th>
          <th scope="col">Call Number</th>
          <th scope="col">Status</th>
          <th scope="col">Message</th>
        </tr>
      </thead>
      <tbody>
        {
          items.map(item =>
            (<ItemTableRow
              key={item.id}
              item={item}
              bibId={bibId}
              searchKeywords={searchKeywords}
            />),
          )
        }
      </tbody>
    </table>
  );
};

ItemTable.propTypes = {
  items: PropTypes.array,
  bibId: PropTypes.string,
  id: PropTypes.string,
  searchKeywords: PropTypes.string,
};

ItemTable.defaultProps = {
  id: '',
};

export default ItemTable;
