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
      loading: false,
      bibPage: 1,
      nextUrl: props.nextUrl,
    };
    this.updateBibPage = this.updateBibPage.bind(this);
    this.lastBib = this.lastBib.bind(this);
    this.firstBib = this.firstBib.bind(this);
  }

  lastBib() {
    const {
      bibPage,
      bibs,
    } = this.state;
    return Math.min(10 * bibPage, bibs.length);
  }

  firstBib() {
    const {
      bibPage,
    } = this.state;
    return Math.max(0, 10 * (bibPage - 1));
  }

  updateBibPage(page) {
    const {
      bibs,
      nextUrl,
      bibPage,
    } = this.state;

    if (page < bibPage || this.lastBib() + 10 < bibs.length) {
      this.setState({ bibPage: page });
    } else {
      this.setState({ loading: true }, () => {
        axios(nextUrl)
          .then((res) => {
            const newNextUrl = res.data.next_url;
            const newBibs = bibs.concat(res.data.bibs);
            this.setState({
              bibs: newBibs,
              loading: false,
              nextUrl: newNextUrl,
              bibPage: page,
            }, () => window.scrollTo(0, 300));
          })
          .catch(
            (err) => {
              console.error('error: ', err);
              this.setState({ loading: false });
            },
          );
      });
    }
  }

  render() {
    const {
      bibPage,
      lastBib,
      loading,
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
          !loading ?
            <ResultsList results={bibs.slice(this.firstBib(), this.lastBib())} />
          :
            <div className="subjectHeadingShowLoadingWrapper">
              <div className="loadingLayer-texts subjectHeadingShow">
                <span
                  id="loading-animation"
                  className="loadingLayer-texts-loadingWord subjectHeadingShow"
                >
                  Loading More Titles
                </span>
                <div className="loadingDots">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
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
