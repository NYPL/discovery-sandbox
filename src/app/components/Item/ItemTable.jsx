import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray } from 'underscore';

import ItemTableRow from './ItemTableRow';

const ItemTable = ({ items, holdings, bibId, id, searchKeywords, page }) => {
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    return null;
  }

  const includeVolColumn = (
    items.some(item => item.isSerial)
    && holdings && holdings.some(holding => holding.checkInBoxes.some(checkInBox => checkInBox.coverage))
  );

  return (
    <table className="nypl-basic-table" id={id}>
      <caption className="hidden">Item details</caption>
      <thead>
        <tr>
          {includeVolColumn ? <th scope="col">Vol/Date</th> : null}
          {page !== 'SearchResults' ? <th scope="col">Format</th> : null}
          <th scope="col">Access</th>
          <th scope="col">Status</th>
          <th scope="col">Call Number</th>
          <th scope="col">Location</th>
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
              includeVolColumn={includeVolColumn}
              page={page}
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
  holdings: PropTypes.array,
  page: PropTypes.string,
};

ItemTable.defaultProps = {
  id: '',
};

export default ItemTable;
