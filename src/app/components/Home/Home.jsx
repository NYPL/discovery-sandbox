import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Search from '../Search/Search.jsx';
import { basicQuery } from '../../utils/utils.js';
import appConfig from '../../../../appConfig.js';

const Home = (props) => (
  <DocumentTitle title="Research Catalog | NYPL">
    <div className="home" id="mainContent">

      <div className="nypl-homepage-hero">
        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <h1>{appConfig.displayTitle}</h1>
              <Search
                spinning={props.spinning}
                createAPIQuery={basicQuery(props)}
              />
            </div>
          </div>

          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <p className="nypl-lead">
                The New York Public Library’s Shared Collection Catalog—now in
                beta—provides researchers with access to materials from NYPL,
                Columbia University, and Princeton University.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="nypl-full-width-wrapper">
        <div className="nypl-row">
          <div className="nypl-column-full">
            <h3 className="nypl-special-title">Research at NYPL</h3>
          </div>
        </div>

        <div className="nypl-row nypl-quarter-image">
          <div className="nypl-column-one-quarter image-column-one-quarter">
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/archives-portal.jpg?itok=-oYtHmeO" alt="" role="presentation" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="/research/collections">Collections</a></h4>
              <p>Discover our world-renowned research collections, featuring more than 46 million items.</p>
          </div>
        </div>

        <div className="nypl-row nypl-quarter-image">
          <div className="nypl-column-one-quarter image-column-one-quarter">
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/sasb.jpg?itok=sdQBITR7" alt="" role="presentation" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="/locations/map?libraries=research">Locations</a></h4>
            <p>Access items, one-on-one reference help, and dedicated research study rooms.</p>
          </div>
        </div>

        <div className="nypl-row nypl-quarter-image">
          <div className="nypl-column-one-quarter image-column-one-quarter">
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/divisions.jpg?itok=O4uSedcp" alt="" role="presentation" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="/research-divisions/">Divisions</a></h4>
            <p>Learn about the subject and media specializations of our research divisions.</p>
          </div>
        </div>

        <div className="nypl-row nypl-quarter-image">
          <div className="nypl-column-one-quarter image-column-one-quarter">
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/plan-you-visit.jpg?itok=scG6cFgy" alt="" role="presentation" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="/research/support">Support</a></h4>
            <p>Plan your in-person research visit and discover resources for scholars and writers.</p>
          </div>
        </div>

        <div className="nypl-row nypl-quarter-image">
          <div className="nypl-column-one-quarter image-column-one-quarter">
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/research-services.jpg?itok=rSo9t1VF" alt="" role="presentation" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="/research/services">Services</a></h4>
            <p>Explore services for online and remote researchers, as well as our interlibrary services.</p>
          </div>
        </div>
      </div>
    </div>
  </DocumentTitle>
);

Home.propTypes = {
  spinning: PropTypes.bool,
};

export default Home;
