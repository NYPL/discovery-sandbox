import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
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
import { buildFieldToOptionsMap, buildReducedItemsAggregations } from '../components/ItemFilters/itemFilterUtils'
import getOwner from '../utils/getOwner';
import appConfig from '../data/appConfig';
import { itemBatchSize } from '../data/constants';
import { RouterProvider } from '../context/RouterContext';

const ItemsContainer = itemsContainerModule.ItemsContainer;

export const BibPage = (
  { bib, location, searchKeywords, resultSelection, features, dispatch },
  context,
) => {
  const useParallels = features && features.includes('parallels');
  const numItemsMatched = bib.numItemsMatched;
  const hash = location.hash || '';
  const showAll = hash === '#view-all-items';

  // Fetch more items only when the patron wants to view all items.
  // If the patron switches to another bib page, or performs a new filter,
  // then stop fetching more items.
  useEffect(() => {
    if (bib && bib.fetchMoreItems || showAll) {
      checkForMoreItems(showAll);
    }
  }, [bib, checkForMoreItems, showAll]);

  /*
   * Checks to see if we need to fetch more items. If the "View All Items"
   * button is clicked, we want to make multiple batch requests to get all
   * the items.
   */
  const checkForMoreItems = useCallback((showAll = false) => {
    if (!bib || !bib.items || !bib.items.length || (bib && bib.done)) {
      // nothing to do
    } else if (bib && bib.items.length >= numItemsMatched || !showAll) {
      // 1. Once we have fetched all the items, we're done, so stop fetching
      //   more items. `fetchMoreItems` is used to trigger the useEffect but
      //   `done` is used to stop the API requests.
      // 2. If `showAll` is false, stop fetching more items. This can happen
      //   if the patron clicks on another bib page or performs a new filter
      //   search.
      dispatch(
        updateBibPage({
          bib: Object.assign({}, bib, { done: true, fetchMoreItems: false })
        })
      );
    } else {
      // We need to fetch for more items.
      const searchStr =
        window.location.search ? `&${window.location.search.substring(1)}` : '';
      const baseUrl = appConfig.baseUrl;
      const itemFrom = !bib.itemFrom ? 0 : bib.itemFrom;

      // Fetch the next batch of items using the `itemFrom` param.
      const bibApi = `${window.location.pathname.replace(
        baseUrl,
        `${baseUrl}/api`,
      )}?items_from=${itemFrom}${searchStr}`;

      ajaxCall(
        bibApi,
        (resp) => {
          // Merge in the new items with the existing items.
          const bibResp = resp.data.bib;
          const done =
            !bibResp || !bibResp.items || bibResp.items.length < itemBatchSize;
          dispatch(
            updateBibPage({
              bib: Object.assign({}, bib, {
                items: bib.done !== undefined ?
                bib.items.concat((bibResp && bibResp.items) || []) : bibResp.items,
                done,
                fetchMoreItems: true,
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
  }, [bib, dispatch, numItemsMatched]);

  if (!bib || parseInt(bib.status, 10) === 404) {
    return <BibNotFound404 context={context} />;
  }

  const bibId = bib['@id'] ? bib['@id'].substring(4) : '';
  const itemsAggregations = bib['itemAggregations'] || [];
  // normalize item aggregations by dropping values with no label and combining duplicate lables

  const reducedItemsAggregations = buildReducedItemsAggregations(itemsAggregations)
  const fieldToOptionsMap = buildFieldToOptionsMap(reducedItemsAggregations)
  const items = LibraryItem.getItems(bib);
  const aggregatedElectronicResources = getAggregatedElectronicResources(items);
  const isElectronicResources = items.every(
    (item) => item.isElectronicResource,
  );

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
  );

  const searchParams = new URLSearchParams(location.search)

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

        {/* Display the items filter container component when:
          1: there are items through the `numItemsMatched` property,
          2: there are items and they are not all electronic resources.
          
          Otherwise, if there are items but they are all electronic resources,
          do not display the items filter container component.
        */}
        {(numItemsMatched && numItemsMatched > 0) ||
          (!isElectronicResources && (!items || items.length > 0)) ?
            <section style={{ marginTop: '20px' }} id="items-table">
              <ItemsContainer
                bibId={bibId}
                displayDateFilter={bib.hasItemDates}
                key={bibId}
                fieldToOptionsMap={fieldToOptionsMap}
                holdings={newBibModel.holdings}
                itemPage={searchParams.get('item_page')}
                items={items}
                itemsAggregations={reducedItemsAggregations}
                numItemsMatched={numItemsMatched}
                searchKeywords={searchKeywords}
                shortenItems={location.pathname.indexOf('all') !== -1}
                showAll={showAll}
              />
            </section>
            : null
        }

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
