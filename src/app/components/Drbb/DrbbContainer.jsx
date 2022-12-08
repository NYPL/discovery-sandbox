import { Heading, Link } from '@nypl/design-system-react-components';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import appConfig from '../../data/appConfig';
import DrbbResult from './DrbbResult';

const DrbbContainer = ({ drbbResults }) => {
  const {
    works,
    totalWorks,
    researchNowQueryString,
  } = drbbResults;
  const hasWorks = works && works.length;

  const content = () => {
    if (hasWorks) {
      return ([
        <ul key="drbb-scc-results-list" className="drbb-list">
          { works.map(work => <DrbbResult key={work.id} work={work} />) }
        </ul>,
        <Link
          className="drbb-description drbb-frontend-link"
          href={{
            pathname: `${appConfig.drbbFrontEnd[appConfig.environment]}/search?`,
            search: researchNowQueryString,
          }}
          target="_blank"
          key="drbb-results-list-link"
        >
          <>
            See {totalWorks.toLocaleString()} result{totalWorks === 1 ? '' : 's'} from Digital Research Books Beta
          </>
        </Link>]);
    }

    return (
      <Link
        className="drbb-description"
        href={appConfig.drbbFrontEnd[appConfig.environment]}
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
      <Heading level="three" className="drbb-main-header" size="tertiary">
        <>
          {hasWorks ? 'Results from' : 'No results found from'} Digital Research Books Beta
        </>
      </Heading>
      <p className="drbb-description">
        Digital books for research from multiple sources world wide-
        all free to read, download, and keep. No Library Card is Required.&nbsp;
        <Link
          target="_blank"
          href={`${appConfig.drbbFrontEnd[appConfig.environment]}/about?source=catalog`}
        >
          Read more about the project
        </Link>.
      </p>
      { content() }
    </div>
  );
};

DrbbContainer.propTypes = {
  drbbResults: PropTypes.object,
};

DrbbContainer.defaultProps = {
  drbbResults: {
    works: [],
    totalWorks: 0,
    researchNowQueryString: '',
  },
};

const mapStateToProps = ({ drbbResults }) => ({ drbbResults });

export default connect(mapStateToProps)(DrbbContainer);
