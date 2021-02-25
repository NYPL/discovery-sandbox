import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  Heading,
  Breadcrumbs,
  Hero,
  HeroTypes,
} from '@nypl/design-system-react-components';

import LoadingLayer from '../LoadingLayer/LoadingLayer';
import SubNav from '../SubNav/SubNav';
import appConfig from '../../data/appConfig';

const SccContainer = (props) => {
  const loading = useSelector(state => state.loading);
  const { useLoadingLayer, children, activeSection, className } = props;

  return (
    <div className="nypl-ds nypl--research layout-container">
      {
        useLoadingLayer ? (
          <LoadingLayer
            loading={loading}
          />
        ) : null
      }
      <main className="main main-page">
        <div className="content-header">
          <Breadcrumbs
            breadcrumbs={[
              { url: 'htttps://www.nypl.org', text: 'Home' },
              { url: 'https://www.nypl.org/research', text: 'Research' },
              { url: appConfig.baseUrl, text: 'Research Catalog' },
            ]}
            className="breadcrumbs"
          />
          <Hero
            heroType={HeroTypes.Secondary}
            heading={(
              <Heading
                level={1}
                id="1"
                blockName="hero"
              >
                {appConfig.displayTitle}
              </Heading>
            )}
          />
          <SubNav activeSection={activeSection} />
        </div>
        <div className={`content-primary ${className}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

SccContainer.propTypes = {
  children: PropTypes.array,
  useLoadingLayer: PropTypes.bool,
  activeSection: PropTypes.string,
  className: PropTypes.string,
};

SccContainer.defaultProps = {
  useLoadingLayer: true,
};

SccContainer.contextTypes = {
  router: PropTypes.object,
};

export default SccContainer;
