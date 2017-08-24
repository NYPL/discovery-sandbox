import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { every as _every } from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ItemHoldings from '../Item/ItemHoldings';
import LoadingLayer from '../LoadingLayer/LoadingLayer.jsx';
import BibDetails from './BibDetails';
import LibraryItem from '../../utils/item';
import BackLink from './BackLink';
import MarcRecord from './MarcRecord';

import { basicQuery } from '../../utils/utils';

class BibPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: this.props.isLoading,
    };

    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
  }

  updateIsLoadingState(status) {
    this.setState({ isLoading: status });
  }

  render() {
    const createAPIQuery = basicQuery(this.props);
    const bib = this.props.bib ? this.props.bib : {};
    const bibId = bib && bib['@id'] ? bib['@id'].substring(4) : '';
    const title = bib.title && bib.title.length ? bib.title[0] : '';
    const items = LibraryItem.getItems(bib);
    const electronicItems = _every(items, (i) => i.isElectronicResource);
    const isNYPLReCAP = LibraryItem.isNYPLReCAP(bib['@id']);
    const bNumber = bib && bib.idBnum ? bib.idBnum : '';
    const searchURL = createAPIQuery({});
    const itemPage = this.props.location.search;
    let shortenItems = true;

    if (this.props.location.pathname.indexOf('all') === -1) {
      shortenItems = false;
    }
    // `linkable` means that those values are links inside the app.
    // `selfLinkable` means that those values are external links and should be self-linked,
    // e.g. the prefLabel is the label and the URL is the id.
    const topFields = [
      { label: 'Title', value: 'titleDisplay', linkable: true },
      { label: 'Author', value: 'creatorLiteral', linkable: true },
      { label: 'Additional Authors', value: 'contributorLiteral', linkable: true },
    ];
    const bottomFields = [
      { label: 'Publication', value: 'React Component' },
      { label: 'Electronic Resource', value: '' },
      { label: 'Description', value: 'extent' },
      { label: 'Subject', value: 'subjectLiteral', linkable: true },
      { label: 'Genre/Form', value: 'materialType' },
      { label: 'Notes', value: '' },
      { label: 'Additional Resources', value: 'supplementaryContent', selfLinkable: true },
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
        searchKeywords={this.props.searchKeywords}
        updateIsLoadingState={this.updateIsLoadingState}
      /> : null;
    const marcRecord = isNYPLReCAP ? <MarcRecord bNumber={bNumber[0]} /> : null;

    return (
      <DocumentTitle title="Item Details | Shared Collection Catalog | NYPL">
        <main className="main-page">
          <LoadingLayer status={this.state.isLoading} title="Searching" />
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper">
              <div className="nypl-row">
                <div className="nypl-column-three-quarters">
                  <Breadcrumbs type="bib" query={searchURL} />
                  <h1>Item Details</h1>
                  <h2>{title}</h2>
                  {
                    this.props.searchKeywords && (
                      <div className="nypl-row search-control">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25" height="42"
                          viewBox="0 0 25 42"
                          preserveAspectRatio="xMidYMid meet"
                          aria-labelledby="left-arrow"
                          aria-hidden="true"
                        >
                          <title id="left-arrow">Back to Results</title>
                          <polygon points="21.172 42.344 0 21.172 21.172 0 25.112 3.939 7.88 21.172 25.112 38.404 21.172 42.344"></polygon>
                        </svg>
                        <BackLink
                          searchURL={searchURL}
                          searchKeywords={this.props.searchKeywords}
                        />
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
  }
}

BibPage.propTypes = {
  item: PropTypes.object,
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  selectedFacets: PropTypes.object,
  bib: PropTypes.object,
  field: PropTypes.string,
  isLoading: PropTypes.bool,
  sortBy: PropTypes.string,
  page: PropTypes.string,
};

export default BibPage;
