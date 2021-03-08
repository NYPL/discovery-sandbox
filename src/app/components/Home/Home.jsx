import React from 'react';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';

import Search from '../Search/Search';
import {
  basicQuery,
  trackDiscovery,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';
import Notification from '../Notification/Notification';

const Home = (props, context) => (
  <DocumentTitle title="Shared Collection Catalog | NYPL">
    <main>
      <div className="home">
        <div className="nypl-homepage-hero">
          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-full">
                <h1>{appConfig.displayTitle}</h1>
                <Notification notificationType="searchResultsNotification" />
              </div>
            </div>

            <div className="nypl-row">
              <div className="nypl-column-full">
                <Search
                  createAPIQuery={basicQuery(props)}
                  router={context.router}
                />
              </div>
            </div>

            <div className="nypl-row">
              <div className="nypl-column-full">
                <p className="nypl-lead">
                  The New York Public Library’s Shared Collection Catalog provides researchers with access to materials from NYPL, Columbia University, and Princeton University.
                  <br />
                  Coming Soon: After undergoing significant enhancements, the Shared Collection Catalog will become the Research Catalog and serve as the primary catalog for NYPL’s research collections in early 2021. <a href='https://www.nypl.org/research/collections/about/shared-collection-catalog'>Learn more.</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-full">
              <h2 className="nypl-special-title">Research at NYPL</h2>
            </div>
          </div>

          <div className="nypl-row nypl-quarter-image">
            <div className="nypl-column-one-quarter image-column-one-quarter">
              <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/media/styles/extralarge/public/archives-portal.jpg?itok=-oYtHmeO" alt="" role="presentation" />
            </div>
            <div className="nypl-column-three-quarters image-column-three-quarters">
              <h3>
                <a href="/research/collections" onClick={() => trackDiscovery('Research Links', 'Collections')}>Collections</a>
              </h3>
              <p>Discover our world-renowned research collections, featuring more than 46
                million items.
              </p>
            </div>
          </div>

          <div className="nypl-row nypl-quarter-image">
            <div className="nypl-column-one-quarter image-column-one-quarter">
              <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/media/styles/extralarge/public/sasb.jpg?itok=sdQBITR7" alt="" role="presentation" />
            </div>
            <div className="nypl-column-three-quarters image-column-three-quarters">
              <h3>
                <a href="/locations/map?libraries=research" onClick={() => trackDiscovery('Research Links', 'Locations')}>Locations</a>
              </h3>
              <p>Access items, one-on-one reference help, and dedicated research study rooms.</p>
            </div>
          </div>

          <div className="nypl-row nypl-quarter-image">
            <div className="nypl-column-one-quarter image-column-one-quarter">
              <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/media/styles/extralarge/public/divisions.jpg?itok=O4uSedcp" alt="" role="presentation" />
            </div>
            <div className="nypl-column-three-quarters image-column-three-quarters">
              <h3>
                <a href="/research-divisions/" onClick={() => trackDiscovery('Research Links', 'Divisions')}>Divisions</a>
              </h3>
              <p>Learn about the subject and media specializations of our research divisions.</p>
            </div>
          </div>

          <div className="nypl-row nypl-quarter-image">
            <div className="nypl-column-one-quarter image-column-one-quarter">
              <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/media/styles/extralarge/public/plan-you-visit.jpg?itok=scG6cFgy" alt="" role="presentation" />
            </div>
            <div className="nypl-column-three-quarters image-column-three-quarters">
              <h3>
                <a href="/research/support" onClick={() => trackDiscovery('Research Links', 'Support')}>Support</a>
              </h3>
              <p>
                Plan your in-person research visit and discover resources for scholars and
                writers.
              </p>
            </div>
          </div>

          <div className="nypl-row nypl-quarter-image">
            <div className="nypl-column-one-quarter image-column-one-quarter">
              <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/media/styles/extralarge/public/research-services.jpg?itok=rSo9t1VF" alt="" role="presentation" />
            </div>
            <div className="nypl-column-three-quarters image-column-three-quarters">
              <h3>
                <a href="/research/services" onClick={() => trackDiscovery('Research Links', 'Services')}>Services</a>
              </h3>
              <p>
                Explore services for online and remote researchers,
                as well as our interlibrary services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </DocumentTitle>
);

Home.contextTypes = {
  router: PropTypes.object,
};

export default Home;
