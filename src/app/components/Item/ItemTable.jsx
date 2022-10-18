import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';

import ItemTableRow from './ItemTableRow';
import StatusLinks from './StatusLinks';
import appConfig from '../../data/appConfig';
import { RouterContext } from '../../context/RouterContext';

const ItemTable = ({ items, bibId, id, searchKeywords, page }) => {
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    return null;
  }

  const { router: { location: { pathname } } } = React.useContext(RouterContext);

  const isBibPage = pathname.includes('/bib/')

  const includeVolColumn = (
    items.some(item => item.volume && item.volume.length) && isBibPage
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
          <thead>
            <tr>
              {isBibPage ? <th scope="col">Status</th> : null}
              {includeVolColumn ? <th scope="col">Vol/Date</th> : null}
              <th scope="col">Format</th>
              {isBibPage ? <th scope="col">Access</th> : null}
              <th scope="col">Call Number</th>
              <th scope="col">Item Location</th>
            </tr>
          </thead>
          <tbody>
            {
              group.map(item =>
              (<ItemTableRow
                isBibPage={isBibPage}
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
          <StatusLinks
            item={group[0]}
            bibId={bibId}
            searchKeywords={searchKeywords}
            appConfig={appConfig}
            page={page}
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
