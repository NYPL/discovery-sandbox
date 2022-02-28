import PropTypes from 'prop-types';
import React from 'react';
import { isArray as _isArray } from 'underscore';
import ItemTableRow from './ItemTableRow';

// TODO: Correct Unused Holdings Property
// Why is this not being used?
// The Items Container passes down a holdings array
// yet this component neever uses it.
const ItemTable = ({ items, holdings, bibId, id, searchKeywords, page }) => {
  if (
    !_isArray(items) ||
    !items.length ||
    items.every((item) => item.isElectronicResource)
  ) {
    return null;
  }
  const SearchResultsPage = page === 'SearchResults';

  const includeVolColumn =
    items.some(({ volume = '' }) => volume.length) && !SearchResultsPage;

  return (
    <table className='nypl-basic-table' id={id}>
      <caption className='hidden'>Item details</caption>
      <thead>
        <tr>
          {includeVolColumn ? <th scope='col'>Vol/Date</th> : null}
          <th scope='col'>Format</th>
          <th scope='col'>Call Number</th>
          <th scope='col'>
            {((SearchResultsPage && `Item `) || '') + `Location`}
          </th>
          {!SearchResultsPage ? (
            <th scope='col'>{`Availability & Access`}</th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ItemTableRow
            key={item.id}
            item={item}
            bibId={bibId}
            searchKeywords={searchKeywords}
            includeVolColumn={includeVolColumn}
            page={page}
          />
        ))}
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
