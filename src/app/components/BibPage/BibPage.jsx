import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from '../Item/ItemHoldings';
import BibDetails from './BibDetails';
import LibraryItem from '../../utils/item';
import BackLink from './BackLink';
import BibMainInfo from './BibMainInfo';
import MarcRecord from './MarcRecord';

import { basicQuery } from '../../utils/utils';

const BibPage = (props) => {
  const createAPIQuery = basicQuery(props);
  const bib = props.bib ? props.bib : {};
  const bibId = bib && bib['@id'] ? bib['@id'].substring(4) : '';
  const title = bib.title && bib.title.length ? bib.title[0] : '';
  const items = LibraryItem.getItems(bib);
  const bNumber = bib && bib.idBnum ? bib.idBnum : '';
  const searchURL = createAPIQuery({});
  let shortenItems = true;

  if (props.location.pathname.indexOf('all') === -1) {
    shortenItems = false;
  }

  return (
    <DocumentTitle title={`${title} | Research Catalog`}>
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            <Breadcrumbs
              query={searchURL.substring(2)}
              type="bib"
              title={title}
            />
            <h1>Research Catalog</h1>
            <BackLink searchURL={searchURL} searchKeywords={props.searchKeywords} />
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters nypl-column-offset-one">
              <Search
                searchKeywords={props.searchKeywords}
                field={props.field}
                spinning={props.spinning}
                createAPIQuery={createAPIQuery}
              />
            </div>
          </div>

          <div className="nypl-row">
            <div
              className="nypl-column-three-quarters nypl-column-offset-one"
              role="region"
              id="mainContent"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="additions removals"
              aria-describedby="results-description"
            >
              <BibMainInfo bib={bib} />
            </div>

            <div className="nypl-column-three-quarters nypl-column-offset-one">
              <div className="nypl-item-details">
                <MarcRecord bNumber={bNumber[0]} />
                <BibDetails
                  bib={bib}
                  title="Bib details"
                />
              </div>
              <div className="">
                <ItemHoldings
                  shortenItems={shortenItems}
                  items={items}
                  bibId={bibId}
                  title={`${bib.numItems} item${bib.numItems === 1 ? '' : 's'}
                    associated with this record:`}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </DocumentTitle>
  );
};

BibPage.propTypes = {
  item: PropTypes.object,
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  selectedFacets: PropTypes.object,
  bib: PropTypes.object,
  field: PropTypes.string,
  spinning: PropTypes.bool,
  sortBy: PropTypes.string,
  page: PropTypes.string,
};

export default BibPage;
