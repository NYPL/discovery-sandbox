import { Button, Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isArray as _isArray, chunk as _chunk } from 'underscore';
import appConfig from '../../data/appConfig';
import {
  bibPageItemsListLimit as itemsListPageLimit,
  itemFilters,
} from '../../data/constants';
import { trackDiscovery } from '../../utils/utils';
import Pagination from '../Pagination/Pagination';
import ItemFilters from './ItemFilters';
import ItemTable from './ItemTable';
import LibraryItem from '../../utils/item'
import { filterItems } from '../../utils/itemsContainer'

class ItemsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showAll: false,
      js: false,
      page: parseInt(this.props.itemPage.substring(10), 10) || 1,
    };
    this.query = context.router.location.query;
    this.hasFilter = Object.keys(this.query).some((param) =>
      itemFilters.map((filter) => filter.type).includes(param),
    );

    // NOTE: filteredItems: Setting 1
    this.filteredItems =
      this.props.bib && this.props.bib.done
      ? filterItems(this.props.items, this.query, this.hasFilter) || []
        : this.props.items || [];

    this.updatePage = this.updatePage.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    // Mostly things we want to do on the client-side only:
    const items = this.filteredItems;
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
    const bibId = this.props.bibId;

    return itemsToDisplay &&
      _isArray(itemsToDisplay) &&
      itemsToDisplay.length ? (
      <ItemTable
        items={itemsToDisplay}
        bibId={bibId}
        id="bib-item-table"
        searchKeywords={this.props.searchKeywords}
          holdings={this.props.holdings}
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
    // NOTE: filteredItems: Setting 2
    this.filteredItems =
      this.props.bib && this.props.bib.done
      ? filterItems(this.props.items, this.query, this.hasFilter) || []
        : this.props.items || [];
    const bibId = this.props.bibId;
    const bibDone = this.props.bib && this.props.bib.done;
    const { items } = this.props;
    if (!items) return null;
    const shortenItems = !this.props.shortenItems;
    let pagination = null;

    let itemsToDisplay = this.filteredItems;
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

      itemsToDisplay = _chunk(items, itemsListPageLimit)[this.state.page - 1];
    }
    const itemTable = this.getTable(
      itemsToDisplay,
      shortenItems,
      this.state.showAll,
    );
    const numItemsEstimate =
      this.props.bib.numItems + (this.props.bib.checkInItems || []).length;
    const itemLoadingMessage = (
      <div className="item-filter-info">
        <h3>
          <br />
          About {`${numItemsEstimate}`} Item
          {numItemsEstimate !== 1 ? 's. ' : '. '}
          <div className="items-loading">
            Still Loading More items
            <span className="dot1">.</span>
            <span className="dot2">.</span>
            <span className="dot3">.</span>
          </div>
        </h3>
      </div>
    );

    return (
      <>
        <Heading level="three">Items in the Library & Off-site</Heading>
        <div className="nypl-results-item">
          {bibDone ? (
            <ItemFilters
              items={items}
              hasFilterApplied={this.hasFilter}
              query={this.query}
              numOfFilteredItems={this.filteredItems.length}
            />
          ) : (
            itemLoadingMessage
          )}
          {itemTable}
          {!!(
            shortenItems &&
            this.filteredItems.length > itemsListPageLimit &&
            !this.state.showAll
          ) && (
            <div className="view-all-items-container">
              {this.state.js ? (
                <Button
                  buttonType='text'
                  onClick={this.showAll}
                  sx={{
                    padding: '0',
                    textDecoration:'underline'
                  }}
                >
                  View All Items
                </Button>
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
  return { bib: state.bib, items }
};

export default {
  ItemsContainer: connect(mapStateToProps)(ItemsContainer),
  unwrappedItemsContainer: ItemsContainer,
};
