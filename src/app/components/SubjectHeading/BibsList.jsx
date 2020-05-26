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
      bibs: [],
      bibPage: 1,
      componentLoading: true,
    };
    this.label = props.label;
    this.sort = context.router.location.query.sort || 'date';
    this.sortDirection = context.router.location.query.sort_direction || 'desc';
    this.updateShepBibPage = this.updateShepBibPage.bind(this);
    this.updateDiscoveryBibPage = this.updateDiscoveryBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = 6;
    this.changeBibSorting = this.changeBibSorting.bind(this);
    this.discoveryApiBibsCall = this.discoveryApiBibsCall.bind(this);
    this.pagination = this.pagination.bind(this);
  }

  componentDidMount() {
    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&per_page=${this.perPage}`;

    this.discoveryApiBibsCall(stringifiedSortParams);
  }

  discoveryApiBibsCall(stringifiedSortParams) {
    const { label } = this;

    return axios(`${appConfig.baseUrl}/api/subjectHeading/${encodeURIComponent(label)}?&${stringifiedSortParams}`)
      .then((res) => {
        this.setState({
          results: res.data,
          componentLoading: false,
          bibsSource: 'discoveryApi',
        });
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

  shepApiBibsCall(stringifiedSortParams) {
    return axios(`${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${this.context.router.params.subjectHeadingUuid}/bibs?${stringifiedSortParams}`)
      .then((res) => {
        this.setState({
          results: res.data.bibs.filter(bib => bib['@id']),
          nextUrl: res.data.next_url,
          componentLoading: false,
          bibsSource: 'shepApi',
        });
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
    const { totalBibs } = this.props;

    return bibsSource === 'discoveryApi' ? results.totalResults : totalBibs;
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
    const { label } = this;

    const stringifiedSortParams = `sort=${this.sort}&sort_direction=${this.sortDirection}&page=${newPage}&per_page=${this.perPage}`;

    this.setState({ componentLoading: true }, () => {
      axios(`${appConfig.baseUrl}/api/subjectHeading/${encodeURIComponent(label)}?&${stringifiedSortParams}`)
        .then(res => this.setState({
          results: res.data,
          componentLoading: false,
          bibsSource: 'discoveryApi',
        }, () => window.scrollTo(0, 300)));
    });
  }

  /*
  * updatePage()
  * @param {integer} newPage the page number of the page being rendered
  */
  updateShepBibPage(newPage) {
    const {
      bibs,
      nextUrl,
      bibPage,
    } = this.state;

    // conditions for a bib page that has already been visited
    // therefore, no new API call
    if (newPage < bibPage || this.lastBib() < bibs.length) {
      this.setState({ bibPage: newPage });
    } else {
      this.setState({ componentLoading: true }, () => {
        axios(nextUrl)
          .then((res) => {
            const newNextUrl = res.data.next_url;
            const newBibs = bibs.concat(res.data.bibs);
            this.setState({
              bibs: newBibs,
              nextUrl: newNextUrl,
              bibPage: newPage,
            }, () => window.scrollTo(0, 300));
          })
          .catch(
            (err) => {
              // eslint-disable-next-line no-console
              console.error('error: ', err);
            },
          );
      });
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
      // paginationProps.createAPIQuery = createAPIQuery
      // paginationProps.updatePage = updatePage
    } else if (bibsSource === 'shepApi') {
      const lastPage = Math.ceil(bibResults.length / this.perPage);
      paginationProps.total = this.props.totalBibs;
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
  };

  render() {
    const {
      bibPage,
      results,
      nextUrl,
      bibsSource,
    } = this.state;

    const {
      totalBibs,
    } = this.props;

    const {
      label,
      sort,
      sortDirection,
    } = this;

    let bibResults = {};
    bibResults = bibsSource === 'discoveryApi' ? results.itemListElement : results;

    if (this.state.componentLoading) {
      return (
        <LocalLoadingLayer
          message="Loading More Titles"
          classNames="bibsList"
        />
      );
    }

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
        {bibResults.length > 0 ? this.pagination() : null}
      </div>
    );
  }
}

BibsList.propTypes = {

};

BibsList.defaultProps = {

};

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
