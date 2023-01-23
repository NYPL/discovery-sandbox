import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// Components
import BackToSearchResults from '../components/BibPage/BackToSearchResults';
import BibDetails from '../components/BibPage/BibDetails';
import BibNotFound404 from '../components/BibPage/BibNotFound404';
import ElectronicResources from '../components/BibPage/ElectronicResources'
import itemsContainerModule from '../components/Item/ItemsContainer';
import LegacyCatalogLink from '../components/LegacyCatalog/LegacyCatalogLink';
import LibraryHoldings from '../components/BibPage/LibraryHoldings';
import LibraryItem from '../utils/item';
import SccContainer from '../components/SccContainer/SccContainer';
// Utils and configs
import { updateBibPage } from '@Actions';
import { ajaxCall } from '@utils';
import {
  allFields,
  annotatedMarcDetails,
  compressSubjectLiteral,
  getGroupedNotes,
  getIdentifiers,
  stringDirection,
  matchParallels,
} from '../utils/bibDetailsUtils';
import {
  getAggregatedElectronicResources,
  isNyplBnumber,
  pluckAeonLinksFromResource,
} from '../utils/utils';
import getOwner from '../utils/getOwner';
import appConfig from '../data/appConfig';
import { itemBatchSize } from '../data/constants';
import { RouterProvider } from '../context/RouterContext';

const ItemsContainer = itemsContainerModule.ItemsContainer;

const checkForMoreItems = (bib, dispatch, numItemsTotal) => {
  if (!bib || !bib.items || !bib.items.length || (bib && bib.done)) {
    // nothing to do
  } else if (bib && bib.items.length >= numItemsTotal) {
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
  { bib, location, searchKeywords, resultSelection, features, dispatch },
  context,
) => {
  const useParallels = features && features.includes('parallels');
  const numItemsTotal = bib.numItemsTotal;

  useEffect(() => {
    checkForMoreItems(bib, dispatch, numItemsTotal);
  }, [bib, dispatch, numItemsTotal]);

  if (!bib || parseInt(bib.status, 10) === 404) {
    return <BibNotFound404 context={context} />;
  }

  const bibId = bib['@id'] ? bib['@id'].substring(4) : '';
  const itemsAggregations = bib['itemAggregations'] || [];
  const items = LibraryItem.getItems(bib);
  const isElectronicResources = items.every(
    (item) => item.isElectronicResource,
  );
  const aggregatedElectronicResources = getAggregatedElectronicResources(items);

  // Related to removing MarcRecord because the webpack MarcRecord is not working. Sep/28/2017
  // const isNYPLReCAP = LibraryItem.isNYPLReCAP(bib['@id']);
  // const bNumber = bib && bib.idBnum ? bib.idBnum : '';

  const topFields = allFields.top;
  const bottomFields = allFields.bottom(bib);
  // Make a copy of the `bib` so we can add additional fields with
  // computed data values that will make rendering them easier in
  // the `BibDetails` component.
  const newBibModel = matchParallels(bib, useParallels);
  newBibModel['notesGroupedByNoteType'] = getGroupedNotes(newBibModel);
  newBibModel['owner'] = getOwner(bib);
  newBibModel['updatedIdentifiers'] = getIdentifiers(newBibModel, bottomFields);
  newBibModel['updatedSubjectLiteral'] = compressSubjectLiteral(bib);

  const mainHeading = [bib.parallelTitle, bib.title, [' ']].reduce((acc, el) => acc || (el && el.length && el[0]), null);
  const electronicResources = pluckAeonLinksFromResource(
    aggregatedElectronicResources,
    items
  )
  return (
    <RouterProvider value={context}>
      <SccContainer
        useLoadingLayer
        className='nypl-item-details'
        pageTitle='Item Details'
      >
        <section className='nypl-item-details__heading' dir={stringDirection(mainHeading, useParallels)}>
          <Heading level="two">
            {mainHeading}
          </Heading>
          <BackToSearchResults result={resultSelection} bibId={bibId} />
        </section>

        <section style={{ marginTop: '20px' }}>
          <BibDetails
            bib={newBibModel}
            fields={topFields}
            features={features}
          />
          {electronicResources.length ? <ElectronicResources electronicResources={electronicResources} id="electronic-resources"/> : null}
        </section>

        <section style={{ marginTop: '20px' }} id="items-table">
          <ItemsContainer
            key={bibId}
            shortenItems={location.pathname.indexOf('all') !== -1}
            items={items}
            bibId={bibId}
            itemPage={location.search}
            searchKeywords={searchKeywords}
            holdings={newBibModel.holdings}
            itemsAggregations={itemsAggregations}
            numItemsTotal={numItemsTotal}
          />
        </section>

        {newBibModel.holdings && (
          <section style={{ marginTop: '20px' }}>
            <LibraryHoldings holdings={newBibModel.holdings} />
          </section>
        )}

        <section style={{ marginTop: '20px' }}>
          <Heading level="three">Details</Heading>
          <BibDetails
            additionalData={
              isNyplBnumber(newBibModel.uri) && newBibModel.annotatedMarc
                ? annotatedMarcDetails(newBibModel)
                : []
            }
            bib={newBibModel}
            electronicResources={aggregatedElectronicResources}
            fields={bottomFields}
            features={features}
          />
        </section>

        <LegacyCatalogLink
          recordNumber={bibId}
          display={bibId.startsWith('b')}
        />
      </SccContainer>
    </RouterProvider>
  );
};

BibPage.propTypes = {
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  bib: PropTypes.object,
  dispatch: PropTypes.func,
  resultSelection: PropTypes.object,
  features: PropTypes.array,
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
  features,
}) => ({
  bib,
  searchKeywords,
  field,
  selectedFilters,
  page,
  sortBy,
  resultSelection,
  features,
});

export default withRouter(connect(mapStateToProps)(BibPage));
