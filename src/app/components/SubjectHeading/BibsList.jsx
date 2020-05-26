/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import ResultsList from '../ResultsList/ResultsList';
import LocalLoadingLayer from './LocalLoadingLayer';
/* eslint-disable import/first, import/no-unresolved, import/extensions */
import Sorter from '@Sorter';
import appConfig from '@appConfig';
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
    this.updateShepBibPage = this.updateShepBibPage.bind(this);
    this.updateBibPage = this.updateBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = 6;
    this.changeBibSorting = this.changeBibSorting.bind(this);
    this.fetchBibs = this.fetchBibs.bind(this);
    this.pagination = this.pagination.bind(this);
    this.permittedMargin = 0.2;
  }

  componentDidMount() {
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&per_page=${this.perPage}&shep_bib_count=${this.props.shepBibCount}`;

    this.fetchBibs(stringifiedSortParams, () => console.log(this.state));
  }

  fetchBibs(stringifiedSortParams, cb = () => {}) {
    const { label } = this.props;

    return axios(`${appConfig.baseUrl}/api/subjectHeading/${encodeURIComponent(label)}?&${stringifiedSortParams}`)
      .then((res) => {
        const {
          results,
          bibsSource,
          page,
          totalResults,
        } = res.data;
        const newState = {
          bibsSource,
          bibPage: page,
          totalResults,
          componentLoading: false,
        };
        if (bibsSource === 'discoveryApi') {
          newState.results = results;
          this.setState(newState, cb);
        } else if (bibsSource === 'shepApi') {
          this.setState((prevState) => {
            newState.results = prevState.results.concat(results);
            newState.nextUrl = res.data.next_url;
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
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&page=${newPage}&per_page=${this.perPage}&source=${this.state.bibsSource}`;

    this.setState({
      componentLoading: true,
    }, () => this.fetchBibs(
      stringifiedSortParams,
      () => window.scrollTo(0, 300)));
  }

  changeBibSorting({ sort, sortDirection }) {
    const { router } = this.context;

    router.push(`${router.location.pathname}?sort=${sort}&sort_direction=${sortDirection}`);
  }

  pagination() {
    const {
      bibsSource,
      bibPage,
      results,
      nextUrl,
      totalResults,
    } = this.state;

    const paginationProps = {
      perPage: this.perPage,
      ariaControls: 'nypl-results-list',
    };

    if (bibsSource === 'discoveryApi') {
      paginationProps.total = totalResults;
      paginationProps.page = parseInt(bibPage, 10);
      paginationProps.updatePage = this.updateBibPage;
    } else if (bibsSource === 'shepApi') {
      const lastPage = Math.ceil(results.length / this.perPage);
      paginationProps.total = this.props.shepBibCount;
      paginationProps.updatePage = this.updateShepBibPage;
      paginationProps.hasNext = (bibPage < lastPage || nextUrl);
      paginationProps.page = parseInt(bibPage, 10);
      paginationProps.shepBibs = true;
    }

    return (
      <Pagination
        {...paginationProps}
      />
    );
  }

  render() {
    const {
      bibPage,
      results,
      nextUrl,
      bibsSource,
      totalResults,
    } = this.state;

    const {
      label,
    } = this.props;

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

    const h2Text = `Viewing ${this.firstBib() + 1} - ${this.lastBib()} of ${totalResults || ''} items for Heading "${label}"`;

    return (
      <div
        className="nypl-column-half bibsList"
        aria-label="Titles related to this Subject Heading"
      >
        <h2 id="titles">{h2Text}</h2>
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
            <ResultsList results={bibResults} />
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
};

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
