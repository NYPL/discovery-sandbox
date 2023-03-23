import { Button, Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isArray as _isArray } from 'underscore';

import appConfig from '../../data/appConfig';
import {
  bibPageItemsListLimit as itemsListPageLimit,
} from '../../data/constants';
import { trackDiscovery } from '../../utils/utils';
import Pagination from '../Pagination/Pagination';
import ItemFilters from '../ItemFilters/ItemFilters';
import ItemTable from './ItemTable';
import LibraryItem from '../../utils/item'

class ItemsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      js: false,
      page: parseInt(props.itemPage, 10) || 1,
    };
    this.query = context.router.location.query;

    this.updatePage = this.updatePage.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  /*
   * getTable(items, shortenItems,)
   * @description Display an HTML table with item data.
   * @param {array} items The array of items.
   * @param {bool} shortenItems Whether the array needs to be cut off or not.
   */
  getTable(items, shortenItems = false) {
    /*
     * If there are more items than the page limit AND
     * we need to shorten it to the page limit AND
     * not show all
     */
    const { bibId, holdings, searchKeywords, showAll } = this.props;
    const itemsToDisplay =
      items && shortenItems && !showAll
        ? items.slice(0, itemsListPageLimit)
        : items;

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
        item_page: page,
      },
    });
  }

  /*
   * showAll()
   * @description Display all items on the page.
   */
  showAll() {
    trackDiscovery('View All Items', `Click - ${this.props.bibId}`);
    if (this.query && this.query.item_page) {
      delete this.query.item_page;
    }
    this.context.router.push({
      pathname: `${appConfig.baseUrl}/bib/${this.props.bibId}`,
      query: this.query,
      hash: "#view-all-items"
    });
  }

  render() {
    const {
      bibId,
      items,
      itemsAggregations,
      numItemsMatched,
      fieldToOptionsMap,
      showAll,
      finishedLoadingItems,
    } = this.props;
    const shortenItems = !this.props.shortenItems;
    let itemsToDisplay = [...items];
    let pagination = null;

    if (
      this.state.js &&
      numItemsMatched > itemsListPageLimit &&
      !showAll
    ) {
      pagination = (
        <Pagination
          total={numItemsMatched}
          perPage={itemsListPageLimit}
          page={this.state.page}
          updatePage={this.updatePage}
          to={{ pathname: `${appConfig.baseUrl}/bib/${bibId}?item_page=` }}
          ariaControls="bib-item-table"
        />
      );
    }
    const itemTable = this.getTable(itemsToDisplay, shortenItems);

    return (
      <>
        <Heading level="three">Items in the Library & Off-site</Heading>
        <div className="nypl-results-item">
          <ItemFilters
            displayDateFilter={this.props.displayDateFilter}
            fieldToOptionsMap={fieldToOptionsMap}
            itemsAggregations={itemsAggregations}
            numItemsMatched={numItemsMatched}
            showAll={showAll}
            finishedLoadingItems={finishedLoadingItems}
          />
          {itemTable}
          {!!(
            shortenItems &&
            numItemsMatched > itemsListPageLimit &&
            !showAll
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
  bibId: PropTypes.string,
  displayDateFilter: PropTypes.bool,
  fieldToOptionsMap: PropTypes.object,
  holdings: PropTypes.array,
  itemPage: PropTypes.string,
  items: PropTypes.array,
  itemsAggregations: PropTypes.array,
  numItemsMatched: PropTypes.number,
  searchKeywords: PropTypes.string,
  shortenItems: PropTypes.bool,
  showAll: PropTypes.bool,
  finishedLoadingItems: PropTypes.bool,
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
  const items = LibraryItem.getItems(state.bib);
  return { items }
};

export default {
  ItemsContainer: connect(mapStateToProps)(ItemsContainer),
  unwrappedItemsContainer: ItemsContainer,
};
