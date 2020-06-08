import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import appConfig from '../../data/appConfig';
import DrbbItem from './DrbbItem';

class DrbbContainer extends React.Component {
  constructor(props, context) {
    super();
    this.search = context.router.location.search || '';
    this.state = {
      works: [],
      drbbResultsLoading: true,
    };
  }

  componentDidMount() {
    this.fetchResearchNowResults();
  }

  fetchResearchNowResults() {
    axios(`${appConfig.baseUrl}/api/research-now${this.search}`)
      .then((resp) => {
        if (!resp.data || !resp.data.works) {
          this.setState({ drbbResultsLoading: false });
          return;
        }
        this.setState({
          works: resp.data.works,
          totalWorks: resp.data.totalWorks,
          drbbResultsLoading: false,
        });
      })
      .catch(console.error);
  }

  content() {
    const {
      works,
      drbbResultsLoading,
    } = this.state;
    if (drbbResultsLoading) {
      return (
        <div className="drr-loading-layer">
          <span
            className="loading-animation loadingLayer-texts-loadingWord"
          >
            Loading results
          </span>
          <div className="loadingDots">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      );
    }
    if (works && works.length) return works.map(work => <DrbbItem key={work.id} work={work} />);
    return null;
  }

  render() {
    const {
      totalWorks,
    } = this.state;

    return (
      <div className="drbb-container">
        <h3 className="drbb-main-header">
          Results from Digital Research Books Beta
        </h3>
        <p className="drbb-description">
          Find millions of digital books for research from multiple sources world-wide--all free to read, download, and keep. No library card required. This is an early beta test, so we want your feedback! <a className="link" href="/about">Read more about the project</a>.
        </p>
        <ul className="drbb-list">
          { this.content() }
        </ul>
        <a className="drbb-description" href={appConfig.drbbFrontEnd} target="_blank">
          See {totalWorks} results from Digital Research Books Beta
        </a>
      </div>
    );
  }
}

DrbbContainer.contextTypes = {
  router: PropTypes.object,
};

export default DrbbContainer;
