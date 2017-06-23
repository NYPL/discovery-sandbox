import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray } from 'underscore';

import ItemTableRow from './ItemTableRow';

const ItemTable = ({ items, bibId, getRecord }) => {
  if (!_isArray(items) || !items.length) {
    return null;
  }

  return (
    <table className="nypl-basic-table">
      <caption className="hidden">Item details</caption>
      <thead>
        <tr>
          <th>Location</th>
          <th>Call No.</th>
          <th>Status</th>
          <th>Message</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          items.map((item, i) =>
            <ItemTableRow key={i} item={item} bibId={bibId} getRecord={getRecord} />
          )
        }
      </tbody>
    </table>
  );
};

ItemTable.propTypes = {
  items: PropTypes.array,
  bibId: PropTypes.string,
  getRecord: PropTypes.func,
};

export default ItemTable;
