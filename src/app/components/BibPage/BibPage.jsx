/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { every as _every } from 'underscore';
import { LeftWedgeIcon } from '@nypl/dgx-svg-icons';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ItemHoldings from '../Item/ItemHoldings';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import BibDetails from './BibDetails';
import LibraryItem from '../../utils/item';
import BackLink from './BackLink';
import AdditionalDetailsViewer from './AdditionalDetailsViewer';
import Tabbed from './Tabbed';
import getOwner from '../../utils/getOwner';
// Removed MarcRecord because the webpack MarcRecord is not working. Sep/28/2017
// import MarcRecord from './MarcRecord';

import {
  basicQuery,
  getAggregatedElectronicResources,
} from '../../utils/utils';

class BibPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: this.props.isLoading,
    };

    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
  }

  componentDidMount() {
    if(!this.props.location.hash){
      document.getElementById('bib-title').focus();
    }
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
    const isElectronicResources = _every(items, i => i.isElectronicResource);
    // Related to removing MarcRecord because the webpack MarcRecord is not working. Sep/28/2017
    // const isNYPLReCAP = LibraryItem.isNYPLReCAP(bib['@id']);
    // const bNumber = bib && bib.idBnum ? bib.idBnum : '';
    const searchURL = createAPIQuery({});
    const itemPage = this.props.location.search;
    const aggregatedElectronicResources = getAggregatedElectronicResources(items);
    let shortenItems = true;

    if (this.props.location.pathname.indexOf('all') === -1) {
      shortenItems = false;
    }

    // `linkable` means that those values are links inside the app.
    // `selfLinkable` means that those values are external links and should be self-linked,
    // e.g. the prefLabel is the label and the URL is the id.
    const topFields = [
      { label: 'Title', value: 'titleDisplay' },
      { label: 'Author', value: 'creatorLiteral', linkable: true },
      { label: 'Publication', value: 'publicationStatement' },
      { label: 'Electronic Resource', value: 'React Component' },
      { label: 'Supplementary Content', value: 'supplementaryContent', selfLinkable: true },
    ];

    const bottomFields = [
      { label: 'Additional Authors', value: 'contributorLiteral', linkable: true },
      { label: 'Found In', value: 'partOf' },
      { label: 'Publication Date', value: 'serialPublicationDates' },
      { label: 'Description', value: 'extent' },
      { label: 'Series Statement', value: 'seriesStatement' },
      { label: 'Uniform Title', value: 'uniformTitle' },
      { label: 'Alternative Title', value: 'titleAlt' },
      { label: 'Former Title', value: 'formerTitle' },
      { label: 'Subject', value: 'subjectLiteral', linkable: true },
      { label: 'Genre/Form', value: 'genreForm' },
      { label: 'Notes', value: 'React Component' },
      { label: 'Contents', value: 'tableOfContents' },
      { label: 'Bibliography', value: '' },
      { label: 'ISBN', value: 'identifier', identifier: 'urn:isbn' },
      { label: 'ISSN', value: 'identifier', identifier: 'urn:issn' },
      { label: 'LCC', value: 'identifier', identifier: 'urn:lcc' },
      { label: 'GPO', value: '' },
      { label: 'Other Titles', value: '' },
      { label: 'Owning Institutions', value: '' },
    ];

    const itemHoldings = items.length && !isElectronicResources ? (
      <ItemHoldings
        shortenItems={shortenItems}
        items={items}
        bibId={bibId}
        itemPage={itemPage}
        searchKeywords={this.props.searchKeywords}
        updateIsLoadingState={this.updateIsLoadingState}
      />) : null;
    // Related to removing MarcRecord because the webpack MarcRecord is not working. Sep/28/2017
    // const marcRecord = isNYPLReCAP ? <MarcRecord bNumber={bNumber[0]} /> : null;

    const bibDetails = (<BibDetails
      bib={bib}
      fields={bottomFields}
      electronicResources={aggregatedElectronicResources}
      updateIsLoadingState={this.updateIsLoadingState}
      />);

    const additionalDetails = (<AdditionalDetailsViewer bib={bib}/>);


    const otherLibraries = ['Princeton University Library', 'Columbia University Libraries'];
    const tabs = otherLibraries.includes(getOwner(bib)) ? [{title: 'Details', content: bibDetails}] : [{title: 'Details', content: bibDetails}, {title: 'Full Description', content: additionalDetails}];

    const tabItems = (index) => {
      if (index === 0) {
        return (<BibDetails
          bib={bib}
          fields={bottomFields}
          electronicResources={aggregatedElectronicResources}
          updateIsLoadingState={this.updateIsLoadingState}
        />)
      } else {
        return (<AdditionalDetailsViewer bib={bib}/>)
      }
    }


    return (
      <DocumentTitle title="Item Details | Shared Collection Catalog | NYPL">
        <main className="main-page">
          <LoadingLayer
            status={this.state.isLoading}
            title="Searching"
          />
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper">
              <div className="nypl-row">
                <div className="nypl-column-three-quarters">
                  <Breadcrumbs type="bib" query={searchURL} />
                  <h1>{title}</h1>
                  {
                    this.props.searchKeywords && (
                      <div className="nypl-row search-control">
                        <LeftWedgeIcon
                          preserveAspectRatio="xMidYMid meet"
                          title="Back to Results"
                        />
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
                    logging={true}
                    updateIsLoadingState={this.updateIsLoadingState}
                    electronicResources={aggregatedElectronicResources}
                  />

                  {itemHoldings}

                  <h2>{tabs.map(tab => tab.title).join(" and ")}</h2>
                  <Tabbed tabItems={tabItems} tabs={tabs}
                  hash={this.props.location.hash}/>
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
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  bib: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default BibPage;
