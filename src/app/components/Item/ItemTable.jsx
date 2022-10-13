import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';

import ItemTableRow from './ItemTableRow';
import RequestButtons from './RequestButtons';
import appConfig from '../../data/appConfig';

const ItemTable = ({ items, holdings, bibId, id, searchKeywords, page }) => {
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    return null;
  }

  const includeVolColumn = (
    items.some(item => item.volume && item.volume.length) && page !== 'SearchResults'
  );

  const itemGroups = (page === 'SearchResults' ?
    items.filter(item =>
      !(_isEmpty(item) || item.isElectronicResource)
    ).map(item =>
      [item]
    ) :
    [items]
  );

  return (
    itemGroups.map(group => (
      <div key={`item-${group[0].id}-div`}>
        <table className="nypl-basic-table" id={id} >
        <caption className="hidden">Item details</caption>
        <tbody>
          <tr>
            {includeVolColumn ? <th scope="col">Vol/Date</th> : null}
            <th scope="col">Format</th>
            <th scope="col">Call Number</th>
            <th scope="col">Location</th>
          </tr>
          {
            group.map(item =>
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
          {
            page === 'SearchResults' &&
            <RequestButtons
              item={group[0]}
              bibId={bibId}
              searchKeywords={searchKeywords}
              appConfig={appConfig}
              page={page}
              colSpan={includeVolColumn ? "4" : "3"}
            />
          }
      </div>
      )
    )
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
