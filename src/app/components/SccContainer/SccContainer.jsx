import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Heading,
  Breadcrumbs,
  Hero,
  HeroTypes,
  Link,
} from '@nypl/design-system-react-components';

import Notification from '../Notification/Notification';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import appConfig from '../../data/appConfig';

const SccContainer = (props) => {
  const { features, useLoadingLayer, children } = props;
  console.log('children', children);
  const { baseUrl } = appConfig;
  const includeDrbb = features.includes('drb-integration');
  return (
    <div className="nypl-ds nypl--research layout-container">
      {
        useLoadingLayer ? (
          <LoadingLayer
            loading={props.loading}
          />
        ) : null
      }
      <main className="main">
        <div className="content-header">
          <Breadcrumbs
            breadcrumbs={[
              { url: "htttps://www.nypl.org", text: "Home" },
              { url: "https://www.nypl.org/research", text: "Research" },
              { url: appConfig.baseUrl, text: "Research Catalog" },
            ]}
            className="breadcrumbs"
          />
          <Hero
            heroType={HeroTypes.Secondary}
            heading={(
              <>
                <Heading
                  level={1}
                  id={"1"}
                  text="Research Catalog"
                />
                <nav
                  className="sub-nav apply-brand-styles"
                  aria-label="sub-nav"
                >
                  <Link
                    className="sub-nav__link"
                    href={appConfig.baseUrl}
                  >
                    Search
                  </Link> |&nbsp;
                  <Link
                    className="sub-nav__link"
                    href={`${baseUrl}/subject_headings`}
                  >
                    Subject Heading Explorer
                  </Link> |&nbsp;
                  <span
                    className="sub-nav__active-section"
                  >
                    My Account
                  </span>
                </nav>
              </>
            )}
            className="apply-brand-styles hero"
          />
        </div>
        <div className="content-primary">
          {children}
        </div>
      </main>
    </div>
  );
};

SccContainer.propTypes = {
  children: PropTypes.object,
  useLoadingLayer: PropTypes.bool,
  features: PropTypes.array,
};

SccContainer.defaultProps = {
  useLoadingLayer: true,
};

SccContainer.contextTypes = {
  router: PropTypes.object,
};

export default connect(({ features }) => ({ features }))(SccContainer);
