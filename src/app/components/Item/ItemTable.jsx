import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray } from 'underscore';

import ItemTableRow from './ItemTableRow';

const ItemTable = ({ items, bibId, getRecord }) => {
  if (!_isArray(items) || !items.length) {
    return null;
  }

  return (
    <dl>
      <dd className="multi-item-list">
        <table className="nypl-basic-table">
          <caption className="hidden">Item details</caption>
          <thead>
            <tr>
              <th>LOCATION</th>
              <th>CALL NO.</th>
              <th>STATUS</th>
              <th>MESSAGE</th>
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
      </dd>
    </dl>
  );
};

ItemTable.propTypes = {
  items: PropTypes.array,
  bibId: PropTypes.string,
  getRecord: PropTypes.func,
};

export default ItemTable;
