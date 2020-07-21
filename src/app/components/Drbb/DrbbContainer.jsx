import React from 'react';
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

  const hasWorks = works && works.length;

  const content = () => {
    if (hasWorks) {
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
          See {totalWorks.toLocaleString()} result{totalWorks === 1 ? '' : 's'} from Digital Research Books Beta
        </Link>]);
    }

    return (
      <Link
        className="drbb-description"
        to={appConfig.drbbFrontEnd[appConfig.environment]}
        target="_blank"
        key="drbb-link"
      >
        <div className="drbb-promo">
          <img
            alt="digital-research-book"
            src="./src/client/assets/drbb_promo.png"
          />
        </div>
        Explore Digital Research Books Beta
      </Link>
    );
  };

  return (
    <div className="drbb-container">
      <h3 className="drbb-main-header">
        {hasWorks ? 'Results from' : 'No results found from'} Digital Research Books Beta
      </h3>
      <p className="drbb-description">
        Digital books for research from multiple sources world wide-
        all free to read, download, and keep. No Library Card is Required.&nbsp;
        <span>
          <a
            className="link"
            target="_blank"
            href={`${appConfig.drbbFrontEnd[appConfig.environment]}/about`}
          >
          Read more about the project
          </a>.
        </span>
      </p>
      { content() }
    </div>
  );
};

export default DrbbContainer;
