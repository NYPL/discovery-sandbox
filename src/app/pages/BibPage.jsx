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
  const numItemsTotal = bib.numItemsTotal;
  const numItemsCurrent = bib.items ? bib.items.length : 0;

  // Fetch more items only when we want to, e.g. when the user clicks on
  // the "View All Items" button or the pagination component.
  useEffect(() => {
    if (bib && bib.fetchMoreItems) {
      checkForMoreItems();
    }
  }, [bib, checkForMoreItems]);

  /*
   * Checks to see if we need to fetch more items. If the "View All Items"
   * button is clicked, we want to make multiple batch requests to get all
   * the items. If the pagination component is used, we only want to make
   * one request for the next X items through the `once` argument.
   */
  const checkForMoreItems = useCallback((once = false) => {
    if (!bib || !bib.items || !bib.items.length || (bib && bib.done)) {
      // nothing to do
    } else if (bib && bib.items.length >= numItemsTotal) {
      // Once we have fetched all the items, we're done,
      // so stop fetching more items.
      // `fetchMoreItems` is used to trigger the useEffect but
      // `done` is used to stop the API requests.
      dispatch(
        updateBibPage({
          bib: Object.assign({}, bib, { done: true, fetchMoreItems: false })
        })
      );
    } else {
      // We need to fetch for more items.
      const searchStr = window.location.search;
      const baseUrl = appConfig.baseUrl;
      const itemFrom = bib.itemFrom || itemBatchSize;
      let filterQuery = '';
  
      // If there are filters, we need to add them to the API query.
      if (searchStr) {
        const searchParams = new URLSearchParams(searchStr);
        for (const [qKey, qValue] of searchParams) {
          // For the date filter, we use the direct value.
          if (qKey === 'date') {
            filterQuery += `&${qKey}=${qValue}`;
          } else if (qKey !== "itemPage") {
            // For other filters, we need to map the label to the id.
            filterQuery += `&${qKey}=${fieldToOptionsMap[qKey][qValue]}`;
          }
        }
      }
  
      // Fetch the next batch of items using the `itemFrom` param.
      const bibApi = `${window.location.pathname.replace(
        baseUrl,
        `${baseUrl}/api`,
      )}?itemFrom=${itemFrom}${filterQuery}`;

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
                items: bib.items.concat((bibResp && bibResp.items) || []),
                done,
                fetchMoreItems: once ? false : true,
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
  }, [bib, dispatch, fieldToOptionsMap, numItemsTotal]);

  if (!bib || parseInt(bib.status, 10) === 404) {
    return <BibNotFound404 context={context} />;
  }

  const bibId = bib['@id'] ? bib['@id'].substring(4) : '';
  const itemsAggregations = bib['itemAggregations'] || [];
  // normalize item aggregations by dropping values with no label and combining duplicate lables
  const reducedItemsAggregations = JSON.parse(JSON.stringify(itemsAggregations));
  reducedItemsAggregations.forEach((agg) => {
    const fieldAggregation = agg.values
    const reducedValues = {}
    fieldAggregation.filter(aggregation => aggregation.label?.length)
      .forEach((aggregation) => {
        let label = aggregation.label
        if (label.toLowerCase().replace(/[^\w]/g, '') === 'offsite') { label = "Offsite" }
        if (!reducedValues[label]) {
          reducedValues[label] = new Set()
        }
        reducedValues[label].add(aggregation.value)
      })
    agg.options = Object.keys(reducedValues)
      .map(label => ({ value: Array.from(reducedValues[label]).join(","), label: label }))
  });
  // For every item aggregation, go through every filter in its `values` array
  // and map all the labels to their ids. This is done because the API expects
  // the ids of the filters to be sent over, not the labels.
  const fieldToOptionsMap = reducedItemsAggregations.reduce((accc, aggregation) => {
    const filter = aggregation.field;
    const mappedValues = aggregation.values.reduce((acc, value) => ({
      ...acc,
      [value.label]: value.value
    }), {})
    return {
      ...accc,
      [filter]: mappedValues,
    };
  }, {});
  const items = LibraryItem.getItems(bib);
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
  );

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
            displayDateFilter={bib.hasItemDates}
            key={bibId}
            shortenItems={location.pathname.indexOf('all') !== -1}
            items={items}
            bibId={bibId}
            itemPage={location.search}
            searchKeywords={searchKeywords}
            holdings={newBibModel.holdings}
            itemsAggregations={reducedItemsAggregations}
            fieldToOptionsMap={fieldToOptionsMap}
            numItemsTotal={numItemsTotal}
            numItemsCurrent={numItemsCurrent}
            checkForMoreItems={checkForMoreItems}
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
