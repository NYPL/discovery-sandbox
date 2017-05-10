import React from 'react';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Search from '../Search/Search.jsx';

const Home = ({ sortBy }) => (
  <div className="home" id="mainContent">
    <div className="page-header">
      <div className="content-wrapper">
        <Breadcrumbs />
        <h2>New York Public Library Research Catalog</h2>
      </div>
    </div>

    <div className="nypl-full-width-wrapper">
      <div className="nypl-row">
        <div className="nypl-column-three-quarters nypl-column-offset-one">
          <p className="nypl-lead">Search The New York Public Library's world-renowned collections for
            items available for use at our
            <a href="https://www.nypl.org/locations/map?libraries=research"> research centers</a>.
            Be sure to <a href="https://www.nypl.org/help/request-research-materials">request
            materials</a> in advance to make the most of your time on site.
          </p>

          <Search sortBy={sortBy} />
        </div>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  sortBy: React.PropTypes.string,
};

export default Home;
