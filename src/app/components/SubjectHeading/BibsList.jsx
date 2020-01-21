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
      lastBib: props.shepBibs.length - 1,
      nextUrl: props.nextUrl,
    };
    this.updateBibPage = this.updateBibPage.bind(this);
  }

  updateBibPage(page, type) {
    const {
      bibs,
      lastBib,
      nextUrl,
      bibPage,
    } = this.state;

    if (type === 'Previous') {
      // FIXME: The following sometimes produces a bad `lastBib` value.
      // e.g. If there are a total of 18 bibs, navigating to page "2" will
      // set lastBib to 17. On clicking "Previous", lastBib will be set
      // hereafter to 17-10=7. That will lead to the following call in render:
      //   this.state.bibs.slice(7 - 9, 8)
      // which is not a valid range.
      if (lastBib > 9) this.setState({ lastBib: lastBib - 10, bibPage: bibPage - 1 });
    } else {
      if (lastBib + 10 < bibs.length) {
        this.setState({ lastBib: lastBib + 10, bibPage: bibPage + 1 });
      } else {
        this.setState({ loading: true }, () => {
          axios(nextUrl)
            .then((res) => {
              const newNextUrl = res.data.next_url;
              const newBibs = this.state.bibs.concat(res.data.bibs);
              const newLast = newBibs.length - 1;
              this.setState({
                bibs: newBibs,
                loading: false,
                lastBib: newLast,
                nextUrl: newNextUrl,
                bibPage: this.state.bibPage + 1,
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
        className="bibs-list"
        tabIndex='0'
        aria-label="Titles related to this Subject Heading"
      >
        <h4>Titles</h4>
        {
          !loading ?
            <ResultsList results={bibs.slice(lastBib - 9, lastBib + 1)} />
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
