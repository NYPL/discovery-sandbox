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
  constructor() {
    super();
    this.state = {
      bibs: [],
      bibPage: 1,
      componentLoading: true,
    };
    this.updateBibPage = this.updateBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = 6;
    this.changeBibSorting = this.changeBibSorting.bind(this);
  }

  componentDidMount() {
    const sortParams = this.context.router.location.query;

    const sort = sortParams.sort;
    const sortDirection = sortParams.sort_direction;

    const stringifySortParams = () => (sort && sortDirection ? `?sort=${sort}&sort_direction=${sortDirection}` : '');

    axios(`${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${this.context.router.params.subjectHeadingUuid}/bibs${stringifySortParams()}`)
      .then((res) => {
        this.setState({
          bibs: res.data.bibs.filter(bib => bib['@id']),
          nextUrl: res.data.next_url,
          componentLoading: false,
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

  lastBib() {
    const {
      bibPage,
      bibs,
    } = this.state;
    const perPage = this.perPage;
    return Math.min(perPage * bibPage, bibs.length);
  }

  firstBib() {
    const {
      bibPage,
    } = this.state;
    const perPage = this.perPage;
    return Math.max(0, perPage * (bibPage - 1));
  }

  /*
  * updatePage()
  * @param {integer} newPage the page number of the page being rendered
  */
  updateBibPage(newPage) {
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
      this.setState({}, () => {
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

  render() {
    const {
      bibPage,
      bibs,
      nextUrl,
    } = this.state;

    const sortParams = this.context.router.location.query;

    const sort = sortParams.sort;
    const sortDirection = sortParams.sort_direction;

    const lastPage = Math.ceil(bibs.length / this.perPage);

    const pagination = (
      <Pagination
        updatePage={this.updateBibPage}
        page={bibPage}
        subjectShowPage
        ariaControls="nypl-results-list"
        hasNext={bibPage < lastPage || nextUrl}
      />
    );

    if (this.state.componentLoading) {
      return (
        <LocalLoadingLayer
          message="Loading More Titles"
          classNames="bibsList"
        />
      );
    }

    return (
      <div
        className="nypl-column-half bibsList"
        tabIndex='0'
        aria-label="Titles related to this Subject Heading"
      >
        <h4 id="titles">Titles</h4>
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
          bibs.length > 0 ?
            <ResultsList results={bibs.slice(this.firstBib(), this.lastBib())} />
          :
            <div className="nypl-column-half bibsList">
              There are no titles for this subject heading.
            </div>
        }
        {bibs.length > 0 ? pagination : null}
      </div>
    );
  }
}

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
