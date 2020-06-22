import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';
import DrbbResult from './DrbbResult';
import Store from '../../stores/Store';

const DrbbContainer = () => {
  const {
    works,
    totalWorks,
    researchNowQueryString,
  } = Store.getState().drbbResults;

  const content = () => {
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
  };

  return (
    <div className="drbb-container">
      <h3 className="drbb-main-header">
        Results from Digital Research Books Beta
      </h3>
      <p className="drbb-description">
        Digital books for research from multiple sources world wide-
        all free to read, download, and keep. No Library Card is Required. <span>
          <a
            className="link"
            target="_blanks"
            href={`${appConfig.drbbFrontEnd[appConfig.environment]}/about`}
          >Read more about the project
          </a>.
        </span>
      </p>
      { content() }
    </div>
  );
};

DrbbContainer.contextTypes = {
  router: PropTypes.object,
};

export default DrbbContainer;
