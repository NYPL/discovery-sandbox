import React from 'react';
import PropTypes from 'prop-types';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';

import ItemTableRow from './ItemTableRow';
import StatusLinks from './StatusLinks';
import appConfig from '../../data/appConfig';
import { MediaContext } from '../Application/Application';

const ItemTable = ({ items, bibId, id, searchKeywords, page, isArchiveCollection }) => {
  const media = React.useContext(MediaContext)
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    return null;
  }

  const isBibPage = page !== 'SearchResults'
  const isDesktop = media === 'desktop' || media === 'tablet'
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
  const volText = isDesktop ? 'Vol/Date' : 'Vol/\nDate'
  const archiveColumnText = 'Container';
  const volColumnHeading = isArchiveCollection ? archiveColumnText : volText;

  return (
    itemGroups.map(group => (
      <div key={`item-${group[0].id}-div`} className={ `results-items-element${page === 'SearchResults' ? ' search-results-table-div' : null}`}>
        <table className={`nypl-basic-table${page === 'SearchResults' ? ' fixed-table' : ''}`} id={id} >
          <caption className="hidden">Item details</caption>
          <thead>
            <tr>
              {isBibPage ? <th className={`status-links ${isDesktop ? '' : 'mobile'}`} scope="col">Status</th> : null}
              {includeVolColumn ? <th scope="col">{volColumnHeading}</th> : null}
              <th scope="col">Format</th>
              { (!includeVolColumn && !isDesktop) ? <th scope="col">Call Number</th> : null }
              {isBibPage && isDesktop ? <th scope="col">Access</th> : null}
              {isDesktop ? <><th scope="col">Call Number</th>
                <th scope="col">Item Location</th></> : null}
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
                isDesktop={isDesktop}
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
  isArchiveCollection: PropTypes.bool,
};

ItemTable.defaultProps = {
  id: '',
};

export default ItemTable;
