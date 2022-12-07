/* global window */
import { Heading } from '@nypl/design-system-react-components';
import React from 'react';
import PropTypes from 'prop-types';
import Pagination from '../Pagination/Pagination';
import ResultsList from '../ResultsList/ResultsList';
import LocalLoadingLayer from './LocalLoadingLayer';
/* eslint-disable import/first, import/no-unresolved, import/extensions */
import Sorter from '@Sorter';
import appConfig from '@appConfig';
import CachedAxios from '../../utils/CachedAxios';
/* eslint-enable import/first, import/no-unresolved, import/extensions */

class BibsList extends React.Component {
  constructor(props, context) {
    super();
    this.state = {
      results: [],
      bibPage: 1,
      componentLoading: true,
      bibsSource: null,
    };
    this.sort = context.router.location.query.sort || 'date';
    this.sortDirection = context.router.location.query.sort_direction || 'desc';
    this.fetchBibsFromShep = this.fetchBibsFromShep.bind(this);
    this.updateBibPage = this.updateBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = appConfig.shepBibsLimit;
    this.changeBibSorting = this.changeBibSorting.bind(this);
    this.fetchBibs = this.fetchBibs.bind(this);
    this.pagination = this.pagination.bind(this);
    this.cachedAxios = new CachedAxios();
  }

  componentDidMount() {
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&per_page=${this.perPage}&shep_bib_count=${this.props.shepBibCount}&shep_uuid=${this.props.uuid}`;

    this.fetchBibs(stringifiedSortParams);
  }

  fetchBibs(stringifiedSortParams, cb = () => {}) {
    const { label } = this.props;

    return this.cachedAxios.call(`${appConfig.baseUrl}/api/subjectHeading/${encodeURIComponent(label)}?&${stringifiedSortParams}`)
      .then((res) => {
        const {
          results,
          bibsSource,
          page,
        } = res.data;
        const totalResults = res.data.totalResults || this.state.totalResults;
        const newState = {
          bibsSource,
          bibPage: parseInt(page, 10),
          componentLoading: false,
          totalResults,
        };
        if (bibsSource === 'discoveryApi') {
          newState.results = results;
          this.setState(newState, cb);
        } else if (bibsSource === 'shepApi') {
          newState.nextUrl = res.data.next_url;
          this.setState((prevState) => {
            newState.results = prevState.results.concat(res.data.newResults);
            return newState;
          }, cb);
        }
      })
      .catch(
        (err) => {
          // eslint-disable-next-line no-console
          console.error('error: ', err);
          this.setState({
            componentLoading: false,
          });
        },
      );
  }

  lastBib() {
    const {
      bibPage,
      totalResults,
    } = this.state;
    const perPage = this.perPage;
    return Math.min(perPage * bibPage, totalResults);
  }

  firstBib() {
    const {
      bibPage,
    } = this.state;
    const perPage = this.perPage;
    return Math.max(0, perPage * (bibPage - 1));
  }

  updateBibPage(newPage) {
    const {
      bibsSource,
      results,
      totalResults,
    } = this.state;
    const { perPage } = this;
    const fetchedBibsLength = results.length;
    if (bibsSource === 'shepApi') {
      if (
        fetchedBibsLength < totalResults &&
        newPage * perPage > fetchedBibsLength
      ) this.fetchBibsFromShep(newPage);
      else {
        this.setState({
          bibPage: newPage,
        }, () => window.scrollTo(0, 300));
      }
      return;
    }

    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&page=${newPage}&per_page=${this.perPage}&source=${this.state.bibsSource}`;
    this.setState({
      componentLoading: true,
    }, () => this.fetchBibs(
      stringifiedSortParams,
      () => window.scrollTo(0, 300)));
  }

  fetchBibsFromShep(newPage) {
    const { nextUrl } = this.state;

    return this.cachedAxios.call(nextUrl)
      .then((res) => {
        const results = this.state.results.concat(res.data.results);
        this.setState({
          results,
          nextUrl: res.data.next_url,
          componentLoading: false,
          bibPage: newPage,
        }, () => window.scrollTo(0, 300));
      })
      .catch(
        (err) => {
          // eslint-disable-next-line no-console
          console.error('error: ', err);
          this.setState({
            componentLoading: false,
          });
        },
      );
  }

  changeBibSorting({ sort, sortDirection }) {
    const { router } = this.context;

    router.push(`${router.location.pathname}?sort=${sort}&sort_direction=${sortDirection}`);
  }

  pagination() {
    const {
      bibPage,
      nextUrl,
      totalResults,
    } = this.state;

    const lastPage = Math.ceil(totalResults / this.perPage);

    const paginationProps = {
      perPage: this.perPage,
      ariaControls: 'nypl-results-list',
      updatePage: this.updateBibPage,
      total: parseInt(totalResults, 10),
      page: bibPage,
      hasNext: (bibPage < lastPage || nextUrl),
      subjectShowPage: true,
    };

    return (
      <Pagination
        {...paginationProps}
      />
    );
  }

  render() {
    const {
      results,
      bibsSource,
      totalResults,
    } = this.state;

    const {
      sort,
      sortDirection,
    } = this;

    if (this.state.componentLoading) {
      return (
        <LocalLoadingLayer
          message="Loading More Titles"
          classNames="bibsList"
        />
      );
    }
    const bibResults = bibsSource === 'discoveryApi' ? results : results.slice(this.firstBib(), this.lastBib());

    const numberOfResults = parseInt(totalResults, 10);

    const h3Text = `Viewing ${this.firstBib() + 1} - ${Number.isInteger(numberOfResults) ? `${this.lastBib()} of ${numberOfResults} item${numberOfResults === 1 ? '' : 's'}` : ''}`;

    return (
      <div
        className="nypl-column-half bibsList"
        aria-label="Titles related to this Subject Heading"
      >
        <Heading level="three" id="titles">{h3Text}</Heading>
        <Sorter
          page="shepBibs"
          sortOptions={[
            { val: 'date_desc', label: 'date (new to old)' },
            { val: 'date_asc', label: 'date (old to new)' },
            { val: 'title_asc', label: 'title (a - z)' },
            { val: 'title_desc', label: 'title (z - a)' },
          ]}
          sortBy={`${sort}_${sortDirection}`}
          updateResults={this.changeBibSorting}
        />
        {
          bibResults ?
            <ResultsList results={bibResults} subjectHeadingShow />
          :
            <div className="nypl-column-half bibsList">
              There are no titles for this subject heading.
            </div>
        }
        {bibResults && bibResults.length > 0 ? this.pagination() : null}
      </div>
    );
  }
}

BibsList.propTypes = {
  label: PropTypes.string,
  shepBibCount: PropTypes.number,
  uuid: PropTypes.string,
};

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
