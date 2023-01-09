import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isArray as _isArray, chunk as _chunk } from 'underscore';

import appConfig from '../../data/appConfig';
import {
  bibPageItemsListLimit as itemsListPageLimit,
} from '../../data/constants';
import { trackDiscovery } from '../../utils/utils';
import Pagination from '../Pagination/Pagination';
import ItemFilters from './ItemFilters';
import ItemTable from './ItemTable';
import LibraryItem from '../../utils/item'

class ItemsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showAll: false,
      js: false,
      page: parseInt(this.props.itemPage.substring(10), 10) || 1,
      items: this.props.items || [],
    };
    this.query = context.router.location.query;

    this.updatePage = this.updatePage.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    // Mostly things we want to do on the client-side only:
    const items = this.state.items;
    let chunkedItems = [];
    let noItemPage = false;

    if (items && items.length > itemsListPageLimit) {
      chunkedItems = _chunk(items, itemsListPageLimit);
    }

    // If the `itemPage` URL query is more than the number of pages, then
    // go back to page 1 in the state and remove the query from the URL.
    if (this.state.page > chunkedItems.length) {
      noItemPage = true;
    }

    this.setState({
      js: true,
      page: noItemPage ? 1 : this.state.page,
    });
  }

  // Well, since we get updated items from the API, we need to
  // update the internal state.
  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState(prevState => ({
        ...prevState,
        items: this.props.items,
      }));
    }
  }

  /*
   * getTable(items, shortenItems, showAll)
   * @description Display an HTML table with item data.
   * @param {array} items The array of items.
   * @param {bool} shortenItems Whether the array needs to be cut off or not.
   * @param {bool} showAll Whether all items should be shown on the client side.
   */
  getTable(items, shortenItems = false, showAll) {
    /*
     * If there are more items than the page limit AND
     * we need to shorten it to the page limit AND
     * not show all
     */
    const itemsToDisplay =
      items && shortenItems && !showAll
        ? items.slice(0, itemsListPageLimit)
        : items;
    const { bibId, holdings, searchKeywords } = this.props;

    return itemsToDisplay &&
      _isArray(itemsToDisplay) &&
      itemsToDisplay.length ? (
      <ItemTable
        items={itemsToDisplay}
        bibId={bibId}
        id="bib-item-table"
        searchKeywords={searchKeywords}
        holdings={holdings}
      />
    ) : null;
  }

  /*
   * updatePage(page)
   * @description Update the client-side state of the component's page value.
   * @param {number} page The next number/index of what items should be displayed.
   * @param {string} type Either Next or Previous.
   */
  updatePage(page, type) {
    this.setState({ page });
    trackDiscovery('Pagination', `${type} - page ${page}`);
    this.context.router.push({
      pathname: `${appConfig.baseUrl}/bib/${this.props.bibId}`,
      query: {
        ...this.query,
        itemPage: page,
      },
    });
  }

  /*
   * showAll()
   * @description Display all items on the page.
   */
  showAll() {
    trackDiscovery('View All Items', `Click - ${this.props.bibId}`);
    this.setState({ showAll: true });
  }

  render() {
    const {
      bibId,
      dispatch,
      itemsAggregations,
      numItemsTotal,
      mappedItemsLabelToIds
    } = this.props;
    const shortenItems = !this.props.shortenItems;
    let itemsToDisplay = [...this.state.items];
    let pagination = null;
    

    if (
      this.state.js &&
      itemsToDisplay &&
      itemsToDisplay.length > itemsListPageLimit &&
      !this.state.showAll
    ) {
      pagination = (
        <Pagination
          total={itemsToDisplay.length}
          perPage={itemsListPageLimit}
          page={this.state.page}
          updatePage={this.updatePage}
          to={{ pathname: `${appConfig.baseUrl}/bib/${bibId}?itemPage=` }}
          ariaControls="bib-item-table"
        />
      );
      itemsToDisplay = _chunk(itemsToDisplay, itemsListPageLimit)[this.state.page - 1];
    }
    const itemTable = this.getTable(
      itemsToDisplay,
      shortenItems,
      this.state.showAll,
    );

    return (
      <>
        <Heading level="three">Items in the Library & Off-site</Heading>
        <div className="nypl-results-item">
          <ItemFilters
            items={itemsToDisplay}
            numOfFilteredItems={itemsToDisplay.length}
            itemsAggregations={itemsAggregations}
            dispatch={dispatch}
            numItemsTotal={numItemsTotal}
            mappedItemsLabelToIds={mappedItemsLabelToIds}
          />
          {itemTable}
          {!!(
            shortenItems &&
            numItemsTotal > itemsListPageLimit &&
            !this.state.showAll
          ) && (
            <div className="view-all-items-container">
              {this.state.js ? (
                <a href="#" onClick={this.showAll}>
                  View All Items
                </a>
              ) : (
                <Link
                  to={`${appConfig.baseUrl}/bib/${bibId}/all`}
                  className="view-all-items"
                  onClick={() =>
                    trackDiscovery('View All Items', `Click - ${bibId}`)
                  }
                >
                  View All Items
                </Link>
              )}
            </div>
          )}
          {pagination}
        </div>
      </>
    );
  }
}

ItemsContainer.propTypes = {
  items: PropTypes.array,
  itemPage: PropTypes.string,
  bibId: PropTypes.string,
  shortenItems: PropTypes.bool,
  searchKeywords: PropTypes.string,
  holdings: PropTypes.array,
  itemsAggregations: PropTypes.array,
  dispatch: PropTypes.func,
  numItemsTotal: PropTypes.number,
  mappedItemsLabelToIds: PropTypes.object,
};

ItemsContainer.defaultProps = {
  shortenItems: false,
  searchKeywords: '',
  itemPage: '0'
};

ItemsContainer.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = (state) => {
  const items = (state.bib.checkInItems || []).concat(LibraryItem.getItems(state.bib))
  return { items }
};

export default {
  ItemsContainer: connect(mapStateToProps)(ItemsContainer),
  unwrappedItemsContainer: ItemsContainer,
};
