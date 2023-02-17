import { useCallback, useEffect } from 'react';
import { ajaxCall } from '@utils';
import appConfig from '../data/appConfig';
import { itemBatchSize } from '../data/constants';

/**
 * useViewAllItems: fetch more items only when the patron wants to
 * view all items. Uses the `use` prefix to indicate that this is a
 * custom React hook.
 * @param {object} bib - the bib object.
 * @param {function} dispatch - Redux dispatch function.
 * @param {number} numItemsMatched - the total number of items matched, used
 *  when filtering and to determine if we have fetched all the items.
 * @param {boolean} showAll - boolean to indicate if we should fetch all the
 *   items from a bib.
 * @param {function} updateBibPage - Redux action to update the bib object.
 */
export const useViewAllItems = (
  bib,
  dispatch,
  numItemsMatched,
  showAll = false,
  updateBibPage
) => {
  // If the patron switches to another bib page, or performs a new filter,
  // then stop fetching more items. This happens when the `showAll` prop
  // is true, but the patron performs a new action and the `showAll` prop
  // is set to false.
  useEffect(() => {
    if (bib && bib.fetchMoreItems || showAll) {
      fetchMoreItems(showAll);
    }
  }, [fetchMoreItems, bib, showAll]);

  /*
   * Helper function that checks to see if we need to fetch more items. If the
   * "View All Items" button is clicked, we want to make multiple batch
   * requests to get all the items.
   */
  const fetchMoreItems = useCallback((showAll = false) => {
    if (!bib || !bib.items || !bib.items.length || (bib && bib.done)) {
      // Nothing to do.
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
  }, [bib, dispatch, numItemsMatched, updateBibPage]);
};
