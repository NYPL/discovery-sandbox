import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { every as _every } from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from '../Item/ItemHoldings';
import BibDetails from './BibDetails';
import LibraryItem from '../../utils/item';
import BackLink from './BackLink';
import MarcRecord from './MarcRecord';

import { basicQuery } from '../../utils/utils';
import appConfig from '../../../../appConfig.js';

const BibPage = (props) => {
  const createAPIQuery = basicQuery(props);
  const bib = props.bib ? props.bib : {};
  const bibId = bib && bib['@id'] ? bib['@id'].substring(4) : '';
  const title = bib.title && bib.title.length ? bib.title[0] : '';
  const items = LibraryItem.getItems(bib);
  const electronicItems = _every(items, (i) => i.isElectronicResource);
  const isNYPLReCAP = LibraryItem.isNYPLReCAP(bib['@id']);
  const bNumber = bib && bib.idBnum ? bib.idBnum : '';
  const searchURL = createAPIQuery({});
  const itemPage = props.location.search;
  let shortenItems = true;

  if (props.location.pathname.indexOf('all') === -1) {
    shortenItems = false;
  }
  const topFields = [
    { label: 'Title', value: 'titleDisplay', linkable: true },
    { label: 'Author', value: 'creatorLiteral', linkable: true },
    { label: 'Additional Authors', value: 'contributorLiteral', linkable: true },
  ];
  const bottomFields = [
    { label: 'Publisher', value: 'React Component' },
    { label: 'Electronic Resource', value: '' },
    { label: 'Description', value: 'extent' },
    { label: 'Subject', value: 'subjectLiteral', linkable: true },
    { label: 'Genre/Form', value: 'materialType' },
    { label: 'Notes', value: '' },
    { label: 'Contents', value: 'note' },
    { label: 'Bibliography', value: '' },
    { label: 'ISBN', value: 'identifier', identifier: 'urn:isbn' },
    { label: 'ISSN', value: 'identifier', identifier: 'urn:issn' },
    { label: 'LCC', value: 'identifier', identifier: 'urn:lcc' },
    { label: 'GPO', value: '' },
    { label: 'Other Titles', value: '' },
    { label: 'Owning Institutions', value: '' },
  ];

  const itemHoldings = items.length && !electronicItems ?
    <ItemHoldings
      shortenItems={shortenItems}
      items={items}
      bibId={bibId}
      itemPage={itemPage}
      searchKeywords={props.searchKeywords}
    /> : null;
  const marcRecord = isNYPLReCAP ? <MarcRecord bNumber={bNumber[0]} /> : null;

  return (
    <DocumentTitle title="Item Details | Shared Collection Catalog | NYPL">
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <Breadcrumbs type="bib" query={searchURL} />
                <h2>{appConfig.displayTitle}</h2>
                <Search
                  searchKeywords={props.searchKeywords}
                  field={props.field}
                  spinning={props.spinning}
                  createAPIQuery={createAPIQuery}
                />
                {
                  props.searchKeywords && (
                    <div className="nypl-row search-control">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="42" viewBox="0 0 25 42"
                        preserveAspectRatio="xMidYMid meet" aria-labelledby="left-arrow" aria-hidden="true"
                      >
                        <title id="left-arrow">Back to Results</title>
                        <polygon points="21.172 42.344 0 21.172 21.172 0 25.112 3.939 7.88 21.172 25.112 38.404 21.172 42.344"></polygon>
                      </svg>
                      <BackLink searchURL={searchURL} searchKeywords={props.searchKeywords} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div
              className="nypl-column-three-quarters"
              role="region"
              id="mainContent"
            >
              <div className="nypl-item-details">
                <h1>{title}</h1>
                <BibDetails
                  bib={bib}
                  fields={topFields}
                />

                {itemHoldings}

                <h3>Additional details</h3>
                <BibDetails
                  bib={bib}
                  fields={bottomFields}
                />
                {marcRecord}
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
