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
    this.updateDiscoveryBibPage = this.updateDiscoveryBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = 6;
    this.changeBibSorting = this.changeBibSorting.bind(this);
    this.discoveryApiBibsCall = this.discoveryApiBibsCall.bind(this);
    this.shepApiBibsCall = this.shepApiBibsCall.bind(this);
    this.pagination = this.pagination.bind(this);
    this.permittedMargin = 0.2;
    this.useDiscoveryResults = this.useDiscoveryResults.bind(this);
  }

  componentDidMount() {
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&per_page=${this.perPage}&shep_bib_count=${this.props.shepBibCount}`;

    this.discoveryApiBibsCall(stringifiedSortParams);
  }

  useDiscoveryResults(discoveryApiBibCount) {
    const { shepBibCount } = this.props;
    if (shepBibCount === 0) return true;
    if (discoveryApiBibCount === 0) return false;
    const discrepancy = Math.abs(shepBibCount - discoveryApiBibCount);

    return discrepancy < (shepBibCount * this.permittedMargin);
  }

  discoveryApiBibsCall(stringifiedSortParams, cb = () => {}) {
    const { label } = this.props;
    const { bibsSource } = this.state;

    return axios(`${appConfig.baseUrl}/api/subjectHeading/${encodeURIComponent(label)}?&${stringifiedSortParams}`)
      .then((res) => {
        const totalResults = res.data.totalResults;
        if (this.bibsSource === 'discoveryApi' || this.useDiscoveryResults(totalResults)) {
          this.setState({
            results: res.data,
            componentLoading: false,
            bibsSource: 'discoveryApi',
            bibPage: res.data.page,
          }, cb);
        } else {
          this.shepApiBibsCall();
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

  shepApiBibsCall(newPage=1, cb = () => {}) {
    console.log("making call to shep api");
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}`;
    const { nextUrl } = this.state;
    const queryUrl = nextUrl || `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${this.context.router.params.subjectHeadingUuid}/bibs?${stringifiedSortParams}`;

    return axios(queryUrl)
      .then((res) => {
        const results = this.state.results.concat(res.data.bibs);
        this.setState({
          results,
          nextUrl: res.data.next_url,
          componentLoading: false,
          bibsSource: 'shepApi',
          bibPage: newPage,
        }, cb);
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

  total() {
    const {
      bibsSource,
      results,
    } = this.state;
    const { shepBibCount } = this.props;

    return bibsSource === 'discoveryApi' ? results.totalResults : shepBibCount;
  }

  lastBib() {
    const {
      bibPage,
    } = this.state;
    const perPage = this.perPage;
    return Math.min(perPage * bibPage, this.total());
  }

  firstBib() {
    const {
      bibPage,
    } = this.state;
    const perPage = this.perPage;
    return Math.max(0, perPage * (bibPage - 1));
  }

  updateDiscoveryBibPage(newPage) {
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&page=${newPage}&per_page=${this.perPage}`;

    this.setState({
      componentLoading: true,
    }, () => this.discoveryApiBibsCall(
      stringifiedSortParams,
      () => window.scrollTo(0, 300)));
  }

  /*
  * updatePage()
  * @param {integer} newPage the page number of the page being rendered
  */
  updateShepBibPage(newPage) {
    const {
      results,
      nextUrl,
      bibPage,
    } = this.state;

    // conditions for a bib page that has already been visited
    // therefore, no new API call
    if (newPage < bibPage || this.lastBib() < results.length) {
      this.setState({ bibPage: newPage }, () => window.scrollTo(0, 300));
    } else {
      this.setState(
        { componentLoading: true },
        () => this.shepApiBibsCall(newPage, () => window.scrollTo(0, 300)));
    }
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
    } = this.state;

    const paginationProps = {
      perPage: this.perPage,
      ariaControls: 'nypl-results-list',
    };

    if (bibsSource === 'discoveryApi') {
      const {
        totalResults,
        page,
      } = this.state.results;
      paginationProps.total = totalResults;
      paginationProps.page = parseInt(page, 10);
      paginationProps.updatePage = this.updateDiscoveryBibPage;
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
    const bibResults = bibsSource === 'discoveryApi' ? results.itemListElement : results.slice(this.firstBib(), this.lastBib());

    const h2Text = `Viewing ${this.firstBib() + 1} - ${this.lastBib()} of ${this.total() || ''} items for Heading "${label}"`;

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

BibsList.defaultProps = {

};

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
