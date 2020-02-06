/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';
import ResultsList from '../Results/ResultsList';

class BibsList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      bibs: props.shepBibs,
      bibPage: 1,
      nextUrl: props.nextUrl,
    };
    this.updateBibPage = this.updateBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
    this.perPage = 6;
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

  updateBibPage(page) {
    const {
      bibs,
      nextUrl,
      bibPage,
    } = this.state;

    const perPage = this.perPage;

    if (page < bibPage || this.lastBib() + perPage < bibs.length) {
      this.setState({ bibPage: page });
    } else {
      this.setState({}, () => {
        axios(nextUrl)
          .then((res) => {
            const newNextUrl = res.data.next_url;
            const newBibs = bibs.concat(res.data.bibs);
            this.setState({
              bibs: newBibs,
              nextUrl: newNextUrl,
              bibPage: page,
            }, () => window.scrollTo(0, 300));
          })
          .catch(
            (err) => {
              console.error('error: ', err);
            },
          );
      });
    }
  }

  render() {
    const {
      bibPage,
      bibs,
    } = this.state;
    const pagination = (
      <Pagination
        updatePage={this.updateBibPage}
        page={bibPage}
        subjectShowPage
        ariaControls="nypl-results-list"
      />
    );
    return (
      <div
        className="nypl-column-half bibs-list"
        tabIndex='0'
        aria-label="Titles related to this Subject Heading"
      >
        <h4>Titles</h4>
        {
          bibs.length > 0 ?
            <ResultsList results={bibs.slice(this.firstBib(), this.lastBib())} />
          :
            <div className="nypl-column-half bibs-list">
              There are no titles for this subject heading.
            </div>
        }
        {pagination}
      </div>
    );
  }
}

BibsList.propTypes = {
  shepBibs: PropTypes.array,
  nextUrl: PropTypes.string,
};

export default BibsList;
