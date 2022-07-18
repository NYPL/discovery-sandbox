import { updateBibPage } from '@Actions';
import { Heading } from '@nypl/design-system-react-components';
import { ajaxCall } from '@utils';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import BackToSearchResults from '../components/BibPage/BackToSearchResults';
import BibNotFound404 from '../components/BibPage/BibNotFound404';
import BottomBibDetails from '../components/BibPage/BottomBibDetails';
import LibraryHoldings from '../components/BibPage/LibraryHoldings';
import TopBibDetails from '../components/BibPage/TopBibDetails';
import itemsContainerModule from '../components/Item/ItemsContainer';
import LegacyCatalogLink from '../components/LegacyCatalog/LegacyCatalogLink';
import SccContainer from '../components/SccContainer/SccContainer';
import appConfig from '../data/appConfig';
import { itemBatchSize } from '../data/constants';
import LibraryItem from '../utils/item';
import {
  getAggregatedElectronicResources,
  pluckAeonLinksFromResource,
} from '../utils/utils';

const ItemsContainer = itemsContainerModule.ItemsContainer;

const checkForMoreItems = (bib, dispatch) => {
  if (!bib || !bib.items || !bib.items.length || (bib && bib.done)) {
    // nothing to do
  } else if (bib && bib.items.length < itemBatchSize) {
    // done
    dispatch(updateBibPage({ bib: Object.assign({}, bib, { done: true }) }));
  } else {
    // need to fetch more items
    const baseUrl = appConfig.baseUrl;
    const itemFrom = bib.itemFrom || itemBatchSize;
    const bibApi = `${window.location.pathname.replace(
      baseUrl,
      `${baseUrl}/api`,
    )}?itemFrom=${itemFrom}`;
    ajaxCall(
      bibApi,
      (resp) => {
        // put items in
        const bibResp = resp.data.bib;
        const done =
          !bibResp || !bibResp.items || bibResp.items.length < itemBatchSize;
        dispatch(
          updateBibPage({
            bib: Object.assign({}, bib, {
              items: bib.items.concat((bibResp && bibResp.items) || []),
              done,
              itemFrom: parseInt(itemFrom, 10) + parseInt(itemBatchSize, 10),
            }),
          }),
        );
      },
      (error) => {
        console.error(error);
      },
    );
  }
};

export const BibPage = (
  { bib, location, searchKeywords, dispatch, resultSelection },
  context,
) => {
  if (!bib || parseInt(bib.status, 10) === 404) {
    return <BibNotFound404 context={context} />;
  }

  if (typeof window !== 'undefined') {
    // check whether this is a server side or client side render
    // by whether 'window' is defined. After the first render on the client side
    // check for more items
    checkForMoreItems(bib, dispatch);
    // NOTE: I'm not entirely sure what this is doing yet, but I believe it should be
    // done in an effect.
  }

  const bibId = bib['@id'] ? bib['@id'].substring(4) : '';
  const items = (bib.checkInItems || []).concat(LibraryItem.getItems(bib));
  const isElectronicResources = items.every(
    (item) => item.isElectronicResource,
  );
  const aggregatedElectronicResources = getAggregatedElectronicResources(items);

  // Related to removing MarcRecord because the webpack MarcRecord is not working. Sep/28/2017
  // const isNYPLReCAP = LibraryItem.isNYPLReCAP(bib['@id']);
  // const bNumber = bib && bib.idBnum ? bib.idBnum : '';

  return (
    <SccContainer
      useLoadingLayer
      className="nypl-item-details"
      pageTitle="Item Details"
    >
      <section className="nypl-item-details__heading">
        <Heading level="two">
          {bib.title && bib.title.length ? bib.title[0] : ' '}
        </Heading>
        <BackToSearchResults result={resultSelection} bibId={bibId} />
      </section>

      <TopBibDetails
        bib={bib}
        resources={pluckAeonLinksFromResource(
          aggregatedElectronicResources,
          items,
        )}
      />

      {items.length && !isElectronicResources && (
        <section style={{ marginTop: '20px' }}>
          <ItemsContainer
            key={bibId}
            shortenItems={location.pathname.indexOf('all') !== -1}
            items={items}
            bibId={bibId}
            itemPage={location.search}
            searchKeywords={searchKeywords}
            holdings={bib.holdings}
          />
        </section>
      )}

      {bib.holdings && (
        <section style={{ marginTop: '20px' }}>
          <LibraryHoldings holdings={bib.holdings} />
        </section>
      )}

      <BottomBibDetails bib={bib} resources={aggregatedElectronicResources} />

      <LegacyCatalogLink recordNumber={bibId} display={bibId.startsWith('b')} />
    </SccContainer>
  );
};

BibPage.propTypes = {
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  bib: PropTypes.object,
  dispatch: PropTypes.func,
  resultSelection: PropTypes.object,
};

BibPage.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = ({
  bib,
  searchKeywords,
  field,
  selectedFilters,
  page,
  sortBy,
  resultSelection,
}) => ({
  bib,
  searchKeywords,
  field,
  selectedFilters,
  page,
  sortBy,
  resultSelection,
});

export default withRouter(connect(mapStateToProps)(BibPage));
