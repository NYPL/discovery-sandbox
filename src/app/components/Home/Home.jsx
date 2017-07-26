import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Search from '../Search/Search.jsx';
import { basicQuery } from '../../utils/utils.js';

const Home = (props) => (
  <DocumentTitle title="Research Catalog | NYPL">
    <div className="home" id="mainContent">

      <div className="nypl-homepage-hero">
        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <h1>Research Discovery (beta)</h1>
              <Search
                spinning={props.spinning}
                createAPIQuery={basicQuery(props)}
              />
            </div>
          </div>

          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <p className="nypl-lead">Try The New York Public Library’s Discovery tool—now in beta—to search for items available for use in our research centers. Be sure to request materials in advance to make the most of your time on site.</p>
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
            <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/archives-portal.jpg?itok=-oYtHmeO" alt="" role="img" />
          </div>
          <div className="nypl-column-three-quarters image-column-three-quarters">
            <h4><a href="#">Collections</a></h4>
              <p>Discover our world-renowned research collections, featuring more than 46 million items.</p>
          </div>
        </div>

       <div className="nypl-row nypl-quarter-image">
         <div className="nypl-column-one-quarter image-column-one-quarter">
           <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/sasb.jpg?itok=sdQBITR7" alt="" role="img" />
         </div>
         <div className="nypl-column-three-quarters image-column-three-quarters">
           <h4><a href="#">Locations</a></h4>
           <p>Access items, one-on-one reference help, and dedicated research study rooms.</p>
        </div>
       </div>

       <div className="nypl-row nypl-quarter-image">
         <div className="nypl-column-one-quarter image-column-one-quarter">
           <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/divisions.jpg?itok=O4uSedcp" alt="" role="img" />
         </div>
         <div className="nypl-column-three-quarters image-column-three-quarters">
           <h4><a href="#">Divisions</a></h4>
           <p>Learn about the subject and media specializations of our research divisions.</p>
         </div>
       </div>

       <div className="nypl-row nypl-quarter-image">
         <div className="nypl-column-one-quarter image-column-one-quarter">
           <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/plan-you-visit.jpg?itok=scG6cFgy" alt="" role="img" />
         </div>
         <div className="nypl-column-three-quarters image-column-three-quarters">
           <h4><a href="#">Support</a></h4>
           <p>Plan your in-person research visit and discover resources for scholars and writers.</p>
         </div>
       </div>

       <div className="nypl-row nypl-quarter-image">
         <div className="nypl-column-one-quarter image-column-one-quarter">
           <img className="nypl-quarter-image" src="https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/extralarge/public/research-services.jpg?itok=rSo9t1VF" alt="" role="img" />
         </div>
         <div className="nypl-column-three-quarters image-column-three-quarters">
           <h4><a href="#">Services</a></h4>
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
