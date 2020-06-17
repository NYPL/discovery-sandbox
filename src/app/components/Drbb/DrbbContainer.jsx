import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';
import DrbbResult from './DrbbResult';

class DrbbContainer extends React.Component {
  constructor(props, context) {
    super();
    this.search = context.router.location.search || '';
    this.state = {
      works: [],
      drbbResultsLoading: true,
      researchNowQueryString: '',
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
          researchNowQueryString: resp.data.researchNowQueryString,
        });
      })
      .catch((resp) => {
        console.error(resp);
        this.setState({
          drbbResultsLoading: false,
        });
      });
  }

  content() {
    const {
      works,
      drbbResultsLoading,
      totalWorks,
      researchNowQueryString,
    } = this.state;

    if (drbbResultsLoading) {
      return (
        <div className="drbb-loading-layer">
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

    if (works && works.length) {
      return ([
        <ul key="drbb-scc-results-list" className="drbb-list">
          { works.map(work => <DrbbResult key={work.id} work={work} />) }
        </ul>,
        <Link
          className="drbb-description drbb-frontend-link"
          to={{
            pathname: `${appConfig.drbbFrontEnd[appConfig.environment]}/search?`,
            search: researchNowQueryString,
          }}
          target="_blank"
          key="drbb-results-list-link"
        >
          See {totalWorks} results from Digital Research Books Beta
        </Link>]);
    }

    return (
      <Link
        className="drbb-description"
        to={{
          pathname: `${appConfig.drbbFrontEnd[appConfig.environment]}/search?`,
        }}
        target="_blank"
        key="drbb-link"
      >
        <div className="drbb-promo">
          <img
            alt="digital-research-book"
            src={require('../../../client/assets/drbb_promo.png').default}
          />
        </div>
        See results from Digital Research Books Beta
      </Link>
    );
  }

  render() {
    return (
      <div className="drbb-container">
        <h3 className="drbb-main-header">
          Results from Digital Research Books Beta
        </h3>
        <p className="drbb-description">
          Digital books for research from multiple sources world wide- all free to read, download, and keep. No Library Card is Required. <span><a
            className="link"
            target="_blanks"
            href={`${appConfig.drbbFrontEnd[appConfig.environment]}/about`}
          >Read more about the project</a>.</span>
        </p>
        { this.content() }
      </div>
    );
  }
}

DrbbContainer.contextTypes = {
  router: PropTypes.object,
};

export default DrbbContainer;
